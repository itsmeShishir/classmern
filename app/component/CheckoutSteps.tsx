import Link from "next/link";

interface Props{
    step1?: boolean; //login
    step2?: boolean; //shipping
    step3?: boolean; //payment
    step4?: boolean; //place order
}

export default function CheckoutSteps({step1, step2, step3, step4}: Props) {
    return (
        <nav className="flex justify-center mb-8">
        <ul className="flex items-center w-full max-w-2xl text-sm font-medium text-center text-gray-500 sm:text-base">
            <li className={`flex md:w-full items-center ${step1 ? 'text-blue-500' : 'text-gray-400'}`}>
                {step1 ? (
                    <Link href="/login" className="text-blue-500 hover:underline">Sign In</Link>
                ) : (
                    <span className="text-gray-400">Sign In</span>
                )}
            </li>
            <li className={`flex md:w-full items-center ${step2 ? 'text-blue-500' : 'text-gray-400'}`}>
                {step2 ? (
                    <Link href="/shipping" className="text-blue-500 hover:underline">Shipping</Link>
                ) : (
                    <span className="text-gray-400">Shipping</span>
                )}
            </li>
            <li className={`flex md:w-full items-center ${step3 ? 'text-blue-500' : 'text-gray-400'}`}>
                {step3 ? (
                    <Link href="/payment" className="text-blue-500 hover:underline">Payment</Link>
                ) : (
                    <span className="text-gray-400">Payment</span>
                )}
            </li>
            <li className={`flex md:w-full items-center ${step4 ? 'text-blue-500' : 'text-gray-400'}`}>
                {step4 ? (
                    <Link href="/placeorder" className="text-blue-500 hover:underline">Place Order</Link>
                ) : (
                    <span className="text-gray-400">Place Order</span>
                )}
            </li>
        </ul>
        </nav>
    )
}