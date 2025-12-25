interface EsewaConfig {
   url: string;
   signature: string;
   uuid: string;
   product_code: string;
   total_amount: number;
   success_url: string;
   failure_url: string;
}

export const esewaCAll = (config: EsewaConfig) => {
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', config.url);


    const formData =[
        { name: 'amount', value: config.total_amount.toString() },
        {name: "tax_amount", value: "0"},
        {name:"total_amount", value: config.total_amount.toString()},
        { name: 'transaction_uuid', value: config.uuid },
        { name: 'product_code', value: config.product_code },
        {name: "product_service_charge", value: "0"},
        { name:"product_delivery_charge", value: "0"},
        { name: 'success_url', value: config.success_url },
        { name: 'failure_url', value: config.failure_url },
        {name: "signed_field_names", value: "total_amount,transaction_uuid,product_code"},
        { name: 'signature', value: config.signature },
    ]

    formData.forEach(({ name, value }) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', name);
        input.setAttribute('value', value);
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
}