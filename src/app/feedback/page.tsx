import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const FeedbackPage: React.FC = () => {
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { error } = await supabase
                .from('feedback')
                .insert([{ message: feedback }]);

            if (error) throw new Error(error.message);

            setSuccess('Feedback submitted successfully!');
            setFeedback('');
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Transform Your Query Management Experience</h1>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                    placeholder="Share your feedback here..."
                    className="border p-2 mb-4"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-blue-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50' : ''}`}
                >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {success && <p className="text-green-500 mt-2">{success}</p>}
            </form>
        </div>
    );
};

export default FeedbackPage;