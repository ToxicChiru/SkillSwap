import React from 'react';
import { Users, GraduationCap } from 'lucide-react';

export const SkillCard = ({ skill, onSelect, isSelected }) => {
  return (
    <div 
      onClick={() => onSelect && onSelect(skill)}
      className={`glass-panel glass-panel-hover ${isSelected ? 'selected-card' : ''}`}
      style={{
        padding: '1.25rem',
        cursor: onSelect ? 'pointer' : 'default',
        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '1.75rem' }}>{skill.icon || '⚡'}</span>
        <span className="badge badge-indigo">{skill.category}</span>
      </div>

      <h4 style={{ marginBottom: '0.35rem', fontSize: '1.1rem' }}>{skill.name}</h4>
      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '2.5rem' }}>
        {skill.description || 'Master this valuable peer skill through 1-on-1 practical exchange.'}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-glass)',
        paddingTop: '0.75rem'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <GraduationCap size={14} color="#818cf8" /> {skill.teachersCount || 1} Tutors
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Users size={14} color="#22d3ee" /> {skill.learnersCount || 1} Learners
        </span>
      </div>
    </div>
  );
};
