import React, { useState } from "react";

const BrowseImage = () => {
  const [file, setFile] = useState();
  //   console.log(file);

  const handleChangeValue = (e) => {
    const reader = new FileReader();

    const fileData = e.target.files[0];
    if (fileData) {
      //   console.log(fileData);
      reader.readAsDataURL(fileData);
    }
    // console.log(reader);
    reader.onload = () => {
      setFile(reader.result);
    };
  };

  return (
    <>
      <div>
        <form>
          <input type="file" onChange={handleChangeValue} />
        </form>
        <div>
          <img
            style={{ height: "500px", width: "500px", objectFit: "contain" }}
            src={file}
            alt="uploaded"
          />
        </div>
      </div>
    </>
  );
};

export default BrowseImage;
