// Florabox mascot — an original black cat with pale jade eyes and a blossom collar.
// Two poses share one palette: SEATED (front three-quarter, used for the logo and
// idling) and SIDE (profile, facing right, used for walking and leaping).

export const CAT = {
  ink:   '#1a0f0a',
  blush: '#c97888',
  petal: '#f2c4ce',
  jade:  '#b9d3a8',
  cream: '#f7f0e4',
};

// ─── Seated pose ── design box x 60–204, y 14–227; paws centred on x≈108, y=227 ──
export const SEATED = {
  head: 'M60,82 C57,66 59,50 63,38 L66,18 L84,40 C93,37.5 103,37.5 112,40 L130,16 L133,38 C138,52 139,68 135,84 C131,100 116,110 98,110 C80,110 64,100 60,82 Z',
  body: 'M78,102 C70,116 66,136 67,156 C68,176 62,198 64,214 C65,222 72,227 82,227 L130,227 C146,227 154,216 152,200 C150,182 139,168 129,160 C125,140 122,120 118,102 Z',
  tail: 'M148,216 C174,218 184,196 178,172 C173,152 178,134 191,128 C198,125 203,129 201,135',
  eyes: [[82, 76], [114, 76]],
  footX: 108,
  footY: 227,
  viewBox: '50 8 164 224',
};

// ─── Side pose ── origin = ground under the body, facing +x ─────────────────────
export const SIDE = {
  body: 'M-70,-84 C-74,-104 -48,-112 -10,-110 C24,-108 48,-110 62,-104 C76,-98 76,-80 64,-72 C44,-62 -30,-62 -56,-68 C-68,-71 -72,-76 -70,-84 Z',
  head: 'M56,-116 C54,-132 62,-144 76,-148 L80,-168 L92,-150 C97,-150 101,-150 105,-148 L116,-164 L116,-140 C125,-132 127,-118 120,-108 C113,-99 100,-96 88,-98 C74,-100 58,-104 56,-116 Z',
  tail: 'M-68,-90 C-96,-94 -110,-118 -104,-146 C-100,-164 -88,-170 -80,-163',
  tailLeap: 'M-68,-88 C-100,-90 -126,-84 -150,-94 C-162,-99 -168,-110 -162,-116',
  // [hipX, hipY, length] — far legs first (drawn behind the body)
  legs: [[-48, -70, 68], [42, -74, 72], [-40, -68, 68], [50, -74, 72]],
};
