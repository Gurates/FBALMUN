import React from 'react';
import { ArrowRight, ArrowUp, ArrowUpRight } from 'lucide-react';
import { COMMITTEES_DATA } from '../data/conferenceData';
import { PageView } from './Navbar';

interface CommitteesPageProps {
  onNavigate: (page: PageView) => void;
  onSelectCommitteeForApply: (committeeId: string) => void;
}

export const CommitteesPage: React.FC<CommitteesPageProps> = ({ onNavigate, onSelectCommitteeForApply }) => (
  <div className="committees-page">
    <div className="committees-content">
      <header className="committees-intro" id="committees-top">
        <p className="committees-eyebrow">FBALMUN 2026 · {COMMITTEES_DATA.length} COMMITTEES</p>
        <h1>Our Committees</h1>
        <p className="committees-intro-copy">Explore the agendas, meet the academic teams, and find your place in the debate.</p>
        <nav className="committees-index" aria-label="Jump to a committee">
          {COMMITTEES_DATA.map(committee => <a key={committee.id} href={`#committee-${committee.id}`}>{committee.acronym}</a>)}
        </nav>
      </header>

      <div className="committees-list">
        {COMMITTEES_DATA.map((committee, index) => {
          const staff = [
            { label: 'USG', value: Array.isArray(committee.usg) ? committee.usg.join(', ') : committee.usg },
            { label: 'Academic Assistant', value: committee.acas },
            { label: 'Head of Crisis', value: committee.hoc },
            { label: 'Crisis Team Member', value: committee.ctm },
            { label: 'Rapporteur', value: committee.rapporteur },
          ].filter(member => member.value);
          return (
            <section className="committee-section" id={`committee-${committee.id}`} key={committee.id} aria-labelledby={`title-${committee.id}`}>
              <div className="committee-section-header">
                <p className="committees-eyebrow"><span className="committee-number">{String(index + 1).padStart(2, '0')}</span>{committee.acronym}</p>
                <p className="committee-meta">{committee.level}<span aria-hidden="true">·</span>{committee.seats} seats</p>
              </div>
              <div className={`committee-section-body${committee.image ? '' : ' committee-without-poster'}`}>
                {committee.image && (
                  <figure className="committee-poster">
                    <a href={committee.image} target="_blank" rel="noopener noreferrer" aria-label={`View ${committee.acronym} poster (new tab)`}>
                      <img src={committee.image} alt={`${committee.acronym} official poster`} loading="lazy" decoding="async" />
                      <figcaption>View full poster <ArrowUpRight size={14} /></figcaption>
                    </a>
                  </figure>
                )}
                <div className="committee-copy">
                  <h2 id={`title-${committee.id}`}>{committee.name}</h2>
                  <p className="committee-description">{committee.description}</p>
                  <div className="committee-agenda"><h3>Agenda</h3><p>{committee.agenda}</p></div>
                  {staff.length > 0 && (
                    <dl className="committee-team">
                      {staff.map(member => <div key={member.label}><dt>{member.label}</dt><dd>{member.value}</dd></div>)}
                    </dl>
                  )}
                  {committee.subCabinets && committee.subCabinets.length > 0 && <div className="committee-cabinets"><h3>Cabinets & allocation</h3><ul>{committee.subCabinets.map(cabinet => <li key={cabinet}>{cabinet}</li>)}</ul></div>}
                  <button type="button" className="committee-apply" onClick={() => { onSelectCommitteeForApply(committee.id); onNavigate('apply'); }}>
                    Apply for {committee.acronym} <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <footer className="committees-end"><span>FBALMUN 2026 · İzmir</span><a href="#committees-top">Back to top <ArrowUp size={15} /></a></footer>
    </div>
  </div>
);
