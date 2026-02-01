'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface FeedbackModalProps {
    missionId: string;
    missionTitle: string;
    onClose: () => void;
    onSubmit: (feedback: { rating: boolean; comment?: string }) => void;
}

export function FeedbackModal({ missionId, missionTitle, onClose, onSubmit }: FeedbackModalProps) {
    const [rating, setRating] = useState<boolean | null>(null);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (rating === null) return;

        onSubmit({ rating, comment: comment.trim() || undefined });
        setSubmitted(true);

        setTimeout(() => {
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md"
            >
                <Card className="relative p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {!submitted ? (
                        <>
                            <h3 className="text-2xl font-bold mb-2">How was this mission?</h3>
                            <p className="text-white/70 mb-6">{missionTitle}</p>

                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => setRating(true)}
                                    className={`flex-1 p-6 rounded-xl border-2 transition-all ${rating === true
                                            ? 'border-green-500 bg-green-500/20'
                                            : 'border-white/20 hover:border-green-500/50'
                                        }`}
                                >
                                    <ThumbsUp className={`w-12 h-12 mx-auto mb-2 ${rating === true ? 'text-green-400' : 'text-white/50'
                                        }`} />
                                    <div className="text-lg font-medium">Helpful</div>
                                </button>

                                <button
                                    onClick={() => setRating(false)}
                                    className={`flex-1 p-6 rounded-xl border-2 transition-all ${rating === false
                                            ? 'border-red-500 bg-red-500/20'
                                            : 'border-white/20 hover:border-red-500/50'
                                        }`}
                                >
                                    <ThumbsDown className={`w-12 h-12 mx-auto mb-2 ${rating === false ? 'text-red-400' : 'text-white/50'
                                        }`} />
                                    <div className="text-lg font-medium">Not Helpful</div>
                                </button>
                            </div>

                            <AnimatePresence>
                                {rating !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Any suggestions? (optional)"
                                            className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 resize-none focus:outline-none focus:border-primary-500 mb-4"
                                            rows={3}
                                        />

                                        <button
                                            onClick={handleSubmit}
                                            className="w-full btn-primary py-3"
                                        >
                                            Submit Feedback
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="text-6xl mb-4">🙏</div>
                            <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
                            <p className="text-white/70">Your feedback helps us improve.</p>
                        </motion.div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}
