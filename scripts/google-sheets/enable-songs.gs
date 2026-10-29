// Append this block at the end of Code.gs, then deploy a new version.
APPLICATION_FIELDS.song = {
  song_title: {label: 'Song name', max: 120, required: true},
  artist: {label: 'Artist', max: 120, required: false}
};
TAB_NAMES.song = 'Song Requests';

// No records are returned; the version marker confirms the deployed code.
function doGet() {
  return jsonResponse({success: false, error: 'Method not allowed.', receiverVersion: 'fbalmun-sheets-song-v2'});
}
