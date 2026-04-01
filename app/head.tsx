const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.dataset.theme = stored;
      return;
    }
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
  } catch (error) {
    document.documentElement.dataset.theme = 'light';
  }
})();
`;

export default function Head() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
    </>
  );
}
