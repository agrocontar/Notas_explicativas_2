/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import api from '@/app/api/api';
import { Message } from 'primereact/message';
import { useAuth } from '@/contexts/authContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const {login} = useAuth()
    const router = useRouter();
    
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            const {user} = response.data

            login(user)

            // Login bem-sucedido - redirecionar para a página inicial
            router.push('/');
        } catch (err: any) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.response?.data?.errors) {
                // Se for erro de validação Zod
                const errors = err.response.data.errors;
                setError(Object.values(errors).flat().join(', '));
            } else {
                setError('Erro ao fazer login. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={containerClassName} style={{
            backgroundImage: "url('/login-bg-compressing.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className="grid grid-nogutter w-full h-screen">
                <div className="col-12 md:col-8 hidden md:block"></div>
                
                <div className="col-12 md:col-4 flex align-items-center justify-content-center bg-white">
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ 
                        borderRadius: '20px',
                    }}>
                        <div className="text-center mb-5">
                            <img 
                                src="/logo.ico" 
                                alt="Logo" 
                                className="mb-4"
                                style={{ height: '50px' }} 
                            />
                            <div className="text-900 text-3xl font-medium mb-3">Notas Explicativas</div>
                        </div>

                        {error && (
                            <Message 
                                severity="error" 
                                text={error}
                                className="w-full mb-4" 
                            />
                        )}

                        <form onSubmit={handleLogin}>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText 
                                id="email1" 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemplo@agrocontar.com.br" 
                                className="w-full mb-5" 
                                style={{ padding: '1rem' }}
                                required
                            />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Senha
                            </label>
                            <Password 
                                inputId="password1" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                feedback={false} 
                                placeholder="Senha" 
                                toggleMask 
                                className="w-full mb-5" 
                                inputClassName="w-full p-3"
                                required
                            />

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox 
                                        inputId="rememberme1" 
                                        checked={checked} 
                                        onChange={(e) => setChecked(e.checked ?? false)} 
                                        className="mr-2"
                                    />
                                    <label htmlFor="rememberme1">Lembrar de mim</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Esqueci minha senha?
                                </a>
                            </div>
                            <Button 
                                label="Login" 
                                className="w-full p-3 text-xl" 
                                type="submit"
                                loading={loading}
                                disabled={loading}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;