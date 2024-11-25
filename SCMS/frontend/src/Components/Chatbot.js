import React, { useState, useEffect, useRef } from 'react';
import axioms from './axioms';
import 'bootstrap/dist/css/bootstrap.min.css';

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messageEndRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);

        try {
            const response = await axioms.post('/chatbot-response/', { message: input });
            const botMessage = { sender: "bot", text: response.data.response };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error in chatbot response:", error);
            const errorMessage = { sender: "bot", text: "Sorry, something went wrong." };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
        setInput('');
    };

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="container mt-4 p-3 border rounded" style={{ maxWidth: '600px', backgroundColor: '#f7f9fc' }}>
            <h5 className="text-center mb-4" style={{ fontFamily: 'Arial, sans-serif', color: '#007bff' }}>Chatbot Assistant</h5>
            <hr />
            <div className="bg-light p-3 rounded shadow-sm" style={{ height: '400px', overflowY: 'auto', backgroundColor: '#e9ecef' }}>
                <div className="d-flex flex-column">
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`d-flex ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"} mb-2`}
                        >
                            <div 
                                className={`p-3 rounded ${msg.sender === "user" ? "bg-primary text-white" : "bg-secondary text-white"}`} 
                                style={{
                                    maxWidth: '75%', 
                                    wordWrap: 'break-word',
                                    fontSize: '1.1rem'
                                }}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="input-group mt-3">
                <input 
                    type="text" 
                    className="form-control" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type your message..." 
                    required 
                    style={{
                        borderRadius: '30px',
                        fontSize: '1rem',
                        padding: '15px',
                    }}
                />
                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{
                        borderRadius: '30px',
                        padding: '12px 20px',
                        fontSize: '1.1rem',
                        marginLeft: '10px',
                        backgroundColor: '#007bff',
                        border: 'none',
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chatbot;