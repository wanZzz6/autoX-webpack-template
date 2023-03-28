const { loadText } = require('./utils');


function show(hello, world = 'world') {
  return `${hello},${world}!`;
}

const hello = loadText();
const result = show(hello);

ui.layout(`
    <vertical>
        <button id="btn1" text="${result}" />
        <button id="btn2" text="${hello}" />
    </vertical>
`);

ui.btn1.on('click', () => {
  toastLog(result);
});

ui.btn2.on('touch', (e) => {
  toastLog(e);
});
