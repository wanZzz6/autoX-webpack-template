const something = './123/something.txt';
function loadText() {
  return files.read(something, 'utf8').trim();
}

module.exports = {
  loadText
};
