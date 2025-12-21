import axios from "axios";
import Order from "../models/orderModel.js";
import { getEsewaSignature } from "../utils/esewa.js";

// initialized esewa -> esewa url -> esewa payment
export const initializedEsewaPayment = async (req, res) => {
    // order id, totalamount
    try{
        const { orderId, totalAmount } = req.body;

        const order = await Order.findById(orderId);
        if(!order){
            return  res.status(404).json({message: "Order not found"});
        }

        // 1. esewa part -> create signature
        const signatureString = `${totalAmount},${order._id},${process.env.ESEWA_PRODUCT_CODE}`;
        const signature = getEsewaSignature(signatureString, process.env.ESEWA_CLIENT_SECRET);

        // 2. esewa part -> return config to frontend  frontend will handel 
        res.json({
            url: process.env.ESEWA_FV_URL,
            signature,
            uuid: order._id,
            product_code: process.env.ESEWA_PRODUCT_CODE,
            total_amount: totalAmount,
            success_url: `${process.env.FRONTEND_URL}/payment/esewa/callback?id=${order._id}`, 
            fail_url: `${process.env.FRONTEND_URL}/payment/failed`
        });

    }catch(e){
        res.status(500).json({message: e.message});
    }
}
// verify payment esewa ->
export const verifyEsewaPayment = async (req, res) => {
    try{
        const {data} = req.body;

        const orderId = req.query.id;

        // decode the data
        const decodeData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));

        // data flow -> decoded data: tid, amt, pid, scd, rid, status, ...
        // esewa -> backend -> esewa verify api
        if (decodeData.status !== 'COMPLETE') {
            return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
        }

        // Verify signature
        const message = decodeData.signed_fields_names.split(',').map((field) => {
            return `${field}=${decodeData[field]}`;
        }).join(',');

        // Update order in DB
        const order = await Order.findById(orderId);
        if(!order){
            return  res.status(404).json({message: "Order not found"});
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentMethod = "Esewa";
        order.paymentResult = {
            id: decodeData.tid,
            status: decodeData.status,
            update_time: Date.now(),
            email_address: 'esewa_user@test.com' // Placeholder as esewa does not provide email
        };

        await order.save();
        // Redirect to success page
        res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${order._id}`);
    }catch(e){
        res.status(500).json({message: e.message});
    }
}


// initialized khalti -> khalti url -> khalti payment
export const initializedKhaltiPayment = async (req, res) => {
    try{
        const { orderId, totalAmount, website_url } = req.body;

        const order = await Order.findById(orderId);
        if(!order){
            return  res.status(404).json({message: "Order not found"});
        }

        // 1. Payload data
        const payload = {
            return_url: `${process.env.FRONTEND_URL}/payment/khalti/callback?id=${order._id}`,
            website_url: website_url,
            amount: totalAmount * 100, // in paisa
            purchase_order_id: order._id.toString(),
            purchase_order_name: `Order_${order._id}`,
            customer_info:{
                name: order.user.name,
                email: order.user.email,
                phone: order.user.phone || "9800000000"
            }
        }

        // 2. Call khalti initiate api
        const response = await axios.post(`${process.env.KHALTI_GATEWAY_URL}/epayment/initiate`, payload, {
            headers: {
                'Authorization': `Key ${process.env.KHALTI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

       res.json(
        response.data
       );

    }catch(e){
        res.status(500).json({message: e.message});
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
        const response = await axios.get(`${process.env.KHALTI_GATEWAY_URL}/epayment/lookup`, {pxid},{
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
        order.paymentMethod = "Khalti";
        order.paymentResult = {
            id: data.pxid,
            status: data.status,
            update_time: Date.now(),
            email_address: data.customer_info.email
        };

        // Save order
        await order.save();
        // Redirect to success page
        res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${order._id}`);
    }catch(e){
        res.status(500).json({message: e.message});
    }
}