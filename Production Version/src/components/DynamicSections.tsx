import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export const DynamicSections = () => {
    const [sections, setSections] = useState<any[]>([]);
    
    const loadFromDB = async () => {
        const { data, error } = await supabase
            .from('site_config')
            .select('value')
            .eq('key', 'global_config')
            .single();

        if (error) {
            const saved = localStorage.getItem('kohiro_profile_config_v1');
            if (saved) setSections(JSON.parse(saved).customSections || []);
            return;
        }

        if (data?.value) {
            setSections(data.value.customSections || []);
        }
    };

    useEffect(() => {
        loadFromDB();
        window.addEventListener('profile-config-updated', loadFromDB);
        return () => window.removeEventListener('profile-config-updated', loadFromDB);
    }, []);

    if (!sections || sections.length === 0) return null;

    return (
        <div className="dynamic-grid-box grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 col-span-full w-full">
            {sections.map((sec, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 } 
                    }}
                    viewport={{ once: true, amount: 0.1 }}
                    style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)', willChange: 'opacity, transform' }}
                    className="split-col glass-card"
                >
                    <div className="section-header-mini flex items-center gap-4 mb-6">
                        <span className="number font-heading text-[11px] text-[var(--c-primary)] mt-[5px]">{String(i + 1).padStart(2, '0')}</span>
                        <h2 className="title text-[18px] font-extrabold tracking-wider text-[var(--c-brand-dark)]">{sec.title || '無題の枠'}</h2>
                    </div>
                    <div className="custom-content-box whitespace-pre-wrap text-[15px] leading-relaxed opacity-90 text-[var(--c-text)] text-left">
                       {sec.content || ''}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
