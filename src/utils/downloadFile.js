export default (data, filename) => {
  const fileURL = window.URL.createObjectURL(new Blob([data]));
  const fileLink = document.createElement('a');
  fileLink.href = fileURL;
  fileLink.setAttribute('download', filename);
  document.body.appendChild(fileLink);

  fileLink.click();
};
