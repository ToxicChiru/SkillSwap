import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SkillCard } from '../components/SkillCard';
import { SwapModal } from '../components/SwapModal';
import { Search, Filter, Users, BookOpen, Star, ArrowLeftRight, UserCheck } from 'lucide-react';

export const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [skills, setSkills] = useState([]);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('skills'); // 'skills' or 'students'
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get('/skills/categories');
        setCategories(data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (viewMode === 'skills') {
        const data = await api.get('/skills', {
          category: activeCategory,
          search: searchQuery
        });
        setSkills(data.skills || []);
      } else {
        const data = await api.get('/users', {
          search: searchQuery
        });
        setStudents(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCategory, searchQuery, viewMode]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Discover Campus Knowledge</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto' }}>
          Explore skills taught by college peers or find students ready to exchange learning sessions.
        </p>
      </div>

      {/* Search & Mode Switcher */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '280px', maxWidth: '500px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.75rem' }}
            placeholder={viewMode === 'skills' ? 'Search by skill name or topic...' : 'Search student by name, college, or skill...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* View Mode Toggle */}
        <div style={{
          background: 'var(--surface-secondary)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          display: 'flex',
          gap: '0.35rem'
        }}>
          <button
            onClick={() => setViewMode('skills')}
            className={`btn btn-sm ${viewMode === 'skills' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <BookOpen size={14} /> Skills Catalog
          </button>
          <button
            onClick={() => setViewMode('students')}
            className={`btn btn-sm ${viewMode === 'students' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={14} /> Peer Students
          </button>
        </div>
      </div>

      {/* Categories Bar (for Skills View) */}
      {viewMode === 'skills' && (
        <div 
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem'
          }}
        >
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`btn btn-sm btn-pill ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.825rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid Content */}
      {viewMode === 'skills' ? (
        <div className="grid-4">
          {skills.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              No skills found matching your filter.
            </div>
          ) : (
            skills.map(skill => (
              <SkillCard
                key={skill._id}
                skill={skill}
                onSelect={() => {
                  setViewMode('students');
                  setSearchQuery(skill.name);
                }}
              />
            ))
          )}
        </div>
      ) : (
        <div className="grid-3">
          {students.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              No students found for this search.
            </div>
          ) : (
            students.map(student => (
              <div
                key={student._id}
                className="glass-panel glass-panel-hover"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <img
                    src={student.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                    alt={student.name}
                    style={{ width: '52px', height: '52px', borderRadius: '14px', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text)' }}>{student.name}</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {student.college} • {student.branch}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                      <Star size={13} fill="var(--accent-amber)" color="var(--accent-amber)" />
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-amber)' }}>
                        {student.rating?.toFixed(1) || '5.0'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ({student.totalReviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '2.5rem' }}>
                  {student.bio || 'Eager student looking to teach and learn on campus.'}
                </p>

                {/* Teaching Skills */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: '700', textTransform: 'uppercase' }}>
                    Can Teach (+10 Coins):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                    {student.teachingSkills?.map((s, idx) => (
                      <span key={idx} className="badge badge-emerald">
                        {s.name} ({s.level})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Wants to learn */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase' }}>
                    Wants To Learn:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                    {student.learningSkills?.map((s, idx) => (
                      <span key={idx} className="badge badge-cyan">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                  {isAuthenticated && student._id !== user?._id ? (
                    <button
                      onClick={() => setSelectedPartner(student)}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <ArrowLeftRight size={14} /> Propose SkillSwap
                    </button>
                  ) : student._id === user?._id ? (
                    <Link
                      to="/profile"
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <UserCheck size={14} /> You (Your Profile)
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      Login to Propose
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Swap Modal */}
      {selectedPartner && (
        <SwapModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};
