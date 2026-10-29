import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, LoaderCircle, Music2, Send, X } from 'lucide-react';
import { submitApplication } from '../lib/applications';

interface SongRequestModalProps { onClose: () => void; }

export const SongRequestModal: React.FC<SongRequestModalProps> = ({ onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sending = useRef(false);
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog?.showModal();
    dialog?.querySelector<HTMLInputElement>('#song-name')?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending.current) return;
    if (!song.trim()) { setError('Please enter a song name.'); return; }
    sending.current = true;
    setStatus('sending');
    setError('');
    try {
      await submitApplication('song', {
        song_title: song.trim(),
        artist: artist.trim(),
      });
      setStatus('success');
    } catch {
      setError('We couldn’t send your song request. Please try again in a moment.');
      setStatus('idle');
    } finally {
      sending.current = false;
    }
  };

  return (
    <dialog ref={dialogRef} className="song-dialog" aria-labelledby="song-title" onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget && !sending.current) dialogRef.current?.close(); }}
      onCancel={(event) => { if (sending.current) event.preventDefault(); }}>
      <div className="song-card">
        <button type="button" className="song-close" aria-label="Close song request" disabled={status === 'sending'} onClick={() => dialogRef.current?.close()}><X size={20} /></button>
        <div className="song-icon"><Music2 size={27} /></div>
        <p className="song-eyebrow">THE SOUNDTRACK OF FBALMUN</p>
        <h2 id="song-title">Choose Your Song</h2>
        {status === 'success' ? (
          <div className="song-success" role="status">
            <CheckCircle2 size={35} />
            <h3>Your song is on the request list!</h3>
            <p>Thanks for suggesting <strong>{song.trim()}</strong>{artist.trim() ? ` by ${artist.trim()}` : ''}. We’ll share your pick with the team.</p>
            <button className="btn-primary song-submit" onClick={() => dialogRef.current?.close()}>DONE</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p className="song-description">What would you like to hear? Add your favorite track to our conference song requests.</p>
            <label htmlFor="song-name">Song name <span aria-hidden="true">*</span></label>
            <input id="song-name" name="song" placeholder="Enter your favorite song" autoFocus required maxLength={120} value={song} disabled={status === 'sending'}
              onChange={(event) => { setSong(event.target.value); setError(''); }} aria-describedby={error ? 'song-error' : undefined} />
            <label htmlFor="song-artist">Artist <span className="song-optional">(optional)</span></label>
            <input id="song-artist" name="artist" placeholder="Who sings it?" maxLength={120} value={artist} disabled={status === 'sending'}
              onChange={(event) => { setArtist(event.target.value); setError(''); }} />
            <div id="song-error" className="song-error" role="alert">{error}</div>
            <button type="submit" className="btn-primary song-submit" disabled={status === 'sending'}>
              {status === 'sending' ? <><LoaderCircle size={17} className="song-loading" /> SENDING…</> : <>SEND YOUR SONG <Send size={16} /></>}
            </button>
            <p className="song-note">A suggestion for our playlist. Playback isn’t guaranteed.</p>
          </form>
        )}
      </div>
    </dialog>
  );
};
