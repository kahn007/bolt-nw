import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

interface CheckoutSectionProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  currency: string;
  cartItems: CartItem[];
  onOrderComplete: () => void;
}

export function CheckoutSection({ isOpen, onClose, total, currency, cartItems, onOrderComplete }: CheckoutSectionProps) {
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const generatedOrderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: generatedOrderNumber,
          customer_email: formData.email,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          total_amount: total,
          currency: currency,
          status: 'completed',
          payment_status: 'paid',
          shipping_address: {
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode
          }
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        size: item.size || null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderNumber(generatedOrderNumber);
      setStep('success');
      onOrderComplete();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to complete order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (e.target.name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').slice(0, 5);
    } else if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setPaymentData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleClose = () => {
    setStep('shipping');
    setOrderNumber('');
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      country: '',
      postalCode: ''
    });
    setPaymentData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: ''
    });
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 smooth-transition ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed inset-0 z-50 overflow-y-auto smooth-transition ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="min-h-screen flex items-center justify-center p-4">
          <div
            className={`bg-[#141414] border border-white/10 rounded-lg w-full max-w-2xl transform smooth-transition ${
              isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
            }`}
            style={{ transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-8 border-b border-white/10">
              <h2 className="text-2xl font-light text-white tracking-[0.1em]">
                {step === 'shipping' ? 'CHECKOUT' : step === 'payment' ? 'PAYMENT' : 'ORDER COMPLETE'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:opacity-70 smooth-transition"
              >
                <X className="w-5 h-5 text-white" strokeWidth={1.5} />
              </button>
            </div>

            {step === 'success' ? (
              <div className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <CheckCircle className="w-20 h-20 text-green-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-light text-white mb-4 tracking-wide">
                  Thank You!
                </h3>
                <p className="text-white/50 text-sm font-light tracking-wide mb-6">
                  Your order has been successfully placed.
                </p>
                <div className="bg-white/5 border border-white/10 rounded p-6 mb-8">
                  <p className="text-white/40 text-xs font-light tracking-wider uppercase mb-2">Order Number</p>
                  <p className="text-white text-lg font-light tracking-wider">{orderNumber}</p>
                </div>
                <p className="text-white/40 text-xs font-light tracking-wide mb-8">
                  A confirmation email has been sent to <span className="text-white">{formData.email}</span>
                </p>
                <button
                  onClick={handleClose}
                  className="w-full bg-white text-black py-4 font-medium tracking-wide hover:bg-white/90 smooth-transition text-sm"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : step === 'shipping' ? (
              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white/50 text-sm font-light tracking-wider uppercase mb-4">
                      Contact Information
                    </h3>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-white/30 smooth-transition font-light"
                    />
                  </div>

                  <div>
                    <h3 className="text-white/50 text-sm font-light tracking-wider uppercase mb-4">
                      Shipping Address
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-white/30 smooth-transition font-light"
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-white/30 smooth-transition font-light"
                        />
                      </div>
                      <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-white/30 smooth-transition font-light"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-white/30 smooth-transition font-light"
                        />
                        <input
                          type="text"
                          name="postalCode"
                          placeholder="Postal Code"
                          value={formData.postalCode}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-white/30 smooth-transition font-light"
                        />
                      </div>
                      <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-white/30 smooth-transition font-light"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <button
                      type="submit"
                      className="w-full bg-white text-black py-4 font-medium tracking-wide hover:bg-white/90 smooth-transition text-sm"
                    >
                      CONTINUE TO PAYMENT
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white/50 text-sm font-light tracking-wider uppercase mb-4">
                      Card Details
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        maxLength={19}
                        required
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-white/30 smooth-transition font-light"
                      />
                      <input
                        type="text"
                        name="cardName"
                        placeholder="Cardholder Name"
                        value={paymentData.cardName}
                        onChange={handlePaymentChange}
                        required
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-white/30 smooth-transition font-light"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={handlePaymentChange}
                          maxLength={5}
                          required
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-white/30 smooth-transition font-light"
                        />
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          maxLength={3}
                          required
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-white/30 smooth-transition font-light"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center text-white mb-6">
                      <span className="text-sm font-light text-white/50 tracking-wide">TOTAL</span>
                      <span className="text-2xl font-light tracking-tight">
                        {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}{total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep('shipping')}
                        className="flex-1 bg-white/10 text-white py-4 font-medium tracking-wide hover:bg-white/20 smooth-transition text-sm"
                      >
                        BACK
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-white text-black py-4 font-medium tracking-wide hover:bg-white/90 smooth-transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'PROCESSING...' : 'COMPLETE ORDER'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
