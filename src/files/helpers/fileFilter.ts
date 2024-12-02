export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  /*  console.log(fileExtension); */
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }

  callback(new Error('File is not an image'), false);

  /*  if (file.mimetype.startsWith('image')) {
    callback(null, true);
    console.log(file);
  } else {
    callback(new Error('File is not an image'), false);
  } */
};
