import axios from "axios";
import Order from "../models/orderModel.js";
import { getEsewaSignature } from "../utils/esewa.js";

// initialized esewa -> esewa url -> esewa payment
export const initializedEsewaPayment = async (req, res) => {
    // order id, totalamount
    try{
        const { orderId, totalAmount, totalPrice } = req.body;

        const order = await Order.findById(orderId);
        if(!order){
            return  res.status(404).json({message: "Order not found"});
        }

        const amount = Number(totalAmount ?? totalPrice ?? order.totalPrice ?? 0);
        if(!amount){
            return res.status(400).json({message: "Invalid amount for eSewa"});
        }

        // 1. esewa part -> create signature over signed fields
        const signedFieldNames = "total_amount,transaction_uuid,product_code";
        const totalAmountFormatted = amount.toFixed(2); // keep exact format for signing and payload
        const signaturePayload = {
            total_amount: totalAmountFormatted,
            transaction_uuid: order._id.toString(),
            product_code: process.env.ESEWA_PRODUCT_CODE,
        };
        const signatureString = signedFieldNames
            .split(",")
            .map((field) => `${field}=${signaturePayload[field]}`)
            .join(",");
        const signature = getEsewaSignature(signatureString, process.env.ESEWA_CLIENT_SECRET);

        // 2. esewa part -> return config to frontend  frontend will handel 
        const frontendBaseUrl = (process.env.FRONTEND_URL || "").replace(/\/+$/, "");
        res.json({
            url: process.env.ESEWA_FV_URL,
            signature,
            uuid: order._id,
            product_code: process.env.ESEWA_PRODUCT_CODE,
            total_amount: signaturePayload.total_amount,
            // success_url: `${process.env.FRONTEND_URL}/payment/esewa/callback?id=${order._id}`, 
            // failure_url: `${process.env.FRONTEND_URL}/payment/failed`,
            success_url: `${frontendBaseUrl}/payment/esewa/callback?orderId=${order._id}`,
            failure_url: `${frontendBaseUrl}/payment/failed?orderId=${order._id}`,
            signed_field_names: signedFieldNames,
        });

    }catch(e){
        res.status(500).json({message: e.message});
    }
}
// verify payment esewa ->
export const verifyEsewaPayment = async (req, res) => {
    try{
        const data = req.body?.data || req.query?.data;
        
        const orderId = req.body?.orderId || req.query?.orderId || req.query?.id;

        if(!data || !orderId){
            return res.status(400).json({message: "Invalid Request"});
        }

        let decodedData;
        try{
            decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        }catch(e){
            return res.status(400).json({message: "Invalid Request"});
        }

    if(decodedData.status !== 'COMPLETE'){
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
    }

        // Update order in DB
        const order = await Order.findById(orderId);
        if(!order){
            return  res.status(404).json({message: "Order not found"});
        }

        if(order.isPaid){
            return res.json({message: "Order already paid"});
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentMethod = "esewa"; // match enum
        order.paymentResult = {
            transationId: decodedData.transaction_id,
            status: decodedData.status,
            totalAmount: decodedData.total_amount,
            paidAt: Date.now(),
            raw: decodedData
        };

        await order.save();
        
        return res.json({
            sucess: true,
            orderId: order._id,
            message: "Payment successful via eSewa"
        })



    }catch(e){
        console.log(e);
        return res.status(500).json({message: e.message});
    }
}


// initialized khalti -> khalti url -> khalti payment
export const initializedKhaltiPayment = async (req, res) => {
    try{
        const { orderId, totalAmount, totalPrice, website_url } = req.body;

        const order = await Order.findById(orderId).populate("user", "name email");
        if(!order){
            return  res.status(404).json({message: "Order not found"});
        }

        const amount = Number(totalAmount ?? totalPrice ?? order.totalPrice ?? 0);
        if(!amount){
            return res.status(400).json({message: "Invalid amount for Khalti"});
        }

        // 1. Payload data
        const payload = {
            // send gateway back to our backend callback which will verify and redirect to frontend
            return_url: `${req.protocol}://${req.get("host")}/api/v1/payment/khalti/callback?id=${order._id}`,
            website_url: website_url || process.env.FRONTEND_URL,
            amount: amount * 100, // in paisa
            purchase_order_id: order._id.toString(),
            purchase_order_name: `Order_${order._id}`,
            customer_info:{
                name: order.user?.name || "Customer",
                email: order.user?.email || "customer@example.com",
                phone: "9800000000"
            }
        }

        // 2. Call khalti initiate api
        const response = await axios.post(`${process.env.KHALTI_GATEWAY_URL}/epayment/initiate`, payload, {
            headers: {
                'Authorization': `Key ${process.env.KHALTI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);

    }catch(e){
        const status = e.response?.status || 500;
        const gatewayMessage = e.response?.data?.detail || e.response?.data?.message || e.message;
        res.status(status >= 400 && status < 600 ? status : 500).json({message: gatewayMessage});
    }
}

// verify payment khalti ->
export const verifyKhaltiPayment = async (req, res) => {
        try{
            const { pxid } = req.query;
            if(!pxid){
                return res.status(400).json({message: "Invalid Request"});
            }
            // Call khalti verify api
            const response = await axios.get(`${process.env.KHALTI_GATEWAY_URL}/epayment/lookup`, {
                params: { pxid },
                headers: {
                    'Authorization': `Key ${process.env.KHALTI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = response.data;
            if(data.status !== 'Completed'){
                return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
            }
            // Update order in DB
        const order = await Order.findById(req.query.id);
        if(!order){
            return  res.status(404).json({message: "Order not found"});
        }
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentMethod = "khalti"; // match enum
        order.paymentResult = {
            id: data.pxid,
            status: data.status,
            update_time: Date.now(),
            email_address: data.customer_info.email
        };

        await order.save();
        res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${order._id}`);
    }catch(e){
        const status = e.response?.status || 500;
        const gatewayMessage = e.response?.data?.detail || e.response?.data?.message || e.message;
        res.status(status >= 400 && status < 600 ? status : 500).json({message: gatewayMessage});
    }
}
