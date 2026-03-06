import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const router = useRouter();

    const handleSignIn = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            router.push('/dashboard');
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : String(err));
        }
    };

    return (
        <div className="auth-container">
            <h1>Transform Your Query Management Experience</h1>
            <form onSubmit={handleSignIn}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default AuthPage;