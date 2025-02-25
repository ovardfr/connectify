import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/fbConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useShoppingCart } from '../hooks';
import Header from '../components/header';
import { TrashIcon } from '../components/icons';

const Pagar = () => {
    const { products, removeProduct, totalAmount, clearShoppingCart } = useShoppingCart();
    const [showAnnouncement, setShowAnnouncement] = useState(false);

    const handlePayment = async () => {
        const orderId = uuidv4();
        const orderDetails = products.map(product => ({
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            total: product.price * product.quantity
        }));

        const order = {
            orderId,
            items: orderDetails,
            totalAmount,
            createdAt: serverTimestamp()
        };

        try {
            const docRef = await addDoc(collection(db, 'orders'), order);
            console.log('Pedido subido con éxito:', docRef.id);
            console.log('Información del pedido:', order);
        } catch (error) {
            console.error('Error al subir el pedido:', error);
        }

        clearShoppingCart();
        setShowAnnouncement(true);
        setTimeout(() => setShowAnnouncement(false), 3000);
    };

    return (
        <div>
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold">Pagar</h1>
                <div className="mt-6">
                    {products.length === 0 ? (
                        <p>No hay platillos en el carrito.</p>
                    ) : (
                        <div>
                            <div className="grid grid-cols-6 gap-4 font-bold mb-2">
                                <span>Imagen</span>
                                <span>Nombre</span>
                                <span>Precio</span>
                                <span>Cantidad</span>
                                <span>Importe</span>
                                <span>Acción</span>
                            </div>
                            {products.map((product) => (
                                <div key={product.id} className="grid grid-cols-6 gap-4 items-center mb-4">
                                    <img src={product.image} alt={product.name} className="w-12" />
                                    <span>{product.name}</span>
                                    <span>S/ {product.price}</span>
                                    <span>{product.quantity}</span>
                                    <span>S/ {product.price * product.quantity}</span>
                                    <button
                                        className="bg-red-600 hover:bg-red-800 text-white rounded-full p-2 flex items-center justify-center"
                                        onClick={() => removeProduct(product.id)}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))}
                            <div className="border-t mt-4 pt-4 flex justify-between items-center">
                                <span className="font-bold text-xl">Total:</span>
                                <span className="font-bold text-xl">S/ {totalAmount}</span>
                            </div>
                            <button
                                className="w-full bg-indigo-600 hover:bg-indigo-800 text-white font-medium rounded-lg px-4 py-2 mt-4"
                                onClick={handlePayment}
                            >
                                Pagar
                            </button>
                        </div>
                    )}
                    {showAnnouncement && (
                        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                            Pedido siendo preparado con mucho amor
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pagar;