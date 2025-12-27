import Order from "../models/orderModel.js";

// get all orders - admin
export const getOrders = async (req, res) => {
    try{
        const orders = await Order.find({}).populate("user", "id name");
        res.json(orders);
    }catch(e){
        res.status(500).json({message: e.message});
    }
}
// create order -> user
export const createOrder = async (req, res) => {
    try{
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if(orderItems && orderItems.length ===0){
            return res.status(400).json({message: "No order items"});
        }else{
            const order = new Order({
                orderItems: orderItems.map((x)=>({
                    ...x,
                    product: x._id,
                    _id: undefined
                })),
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            })

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    }catch(e){
        res.status(500).json({message: e.message});
    }
}
// get order by id
export const getOrderById = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if(order){
            res.json(order);
        }else{
            res.status(404).json({message: "Order not found"});
        }
    }catch(e){
        res.status(500).json({message: e.message});
    }
}
// update order to paid
export const updateOrderToPaid = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id);
        if(order){
            order.isPaid = true;
            order.paidAt = Date.now();

            // save payement details (standart process)
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address
            };
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        }else{
            res.status(404).json({message: "Order not found"});
        }
    }catch(e){
        res.status(500).json({message: e.message});
    }
}
// update order to delivered
export const updateOrderToDelivered = async (req, res) => {
     try{
        const order = await Order.findById(req.params.id);
        if(order){
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        }else{
            res.status(404).json({message: "Order not found"});
        }
    }catch(e){
        res.status(500).json({message: e.message});
    }
}
// get my order
export const getMyOrders = async (req, res) => {
    try{
        const orders = await Order.find({user: req.user._id});
        res.json(orders);
    }catch(e){
        res.status(500).json({message: e.message});
    }
}
