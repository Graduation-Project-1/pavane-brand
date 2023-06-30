import React, { useState } from "react";
import Upload from "../../assets/upload.png";
import ImageUploading from "react-images-uploading";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import imageEndPoint from '../../services/imagesEndPoint';

import "./ImagesUpload.scss";

export default function ImagesUpload({
  label = "",
  type = "view" || "upload" || "edit",
  uploadedImagesList = [],
  setUploadedImagesList = () => { },
  onDleteFromCurrent = () => { },
  viewList = [],
  getImage = () => { },
  selectedImage = ""
}) {
  const onChangeImages = (imageList) => {
    setUploadedImagesList(imageList);
  };

  const onSortEnd = (oldIndex, newIndex) => {
    setUploadedImagesList((array) =>
      arrayMoveImmutable(array, oldIndex, newIndex)
    );
  };

  const [isZoomedImage, setIsZoomedImage] = useState(false);
  const [image, setImage] = useState("");

  return <>

    {isZoomedImage && (
      <div
        className={isZoomedImage ? "overlay-modal-view-image" : "overlay-remove-cancel"}
        id="overlay-remove"
        onClick={() => { setIsZoomedImage(false) }}
      >
        <div className="view-image">
          <img
            src={
              URL.createObjectURL(image)
            }
            alt="Admin Image" />
        </div>
      </div>
    )}

    <ImageUploading
      multiple={true}
      value={uploadedImagesList}
      onChange={onChangeImages}
      dataURLKey="data_url"
      maxNumber={10}
    >
      {({ imageList, onImageUpload, onImageRemove, dragProps }) => (
        <div className="image-upload-container">
          {type !== 'view' && <button
            disabled={type === "view" || imageList?.length === 10}
            className={`upload-img-btn ${type === "view" && "view-only"}`}
            onClick={onImageUpload}
            {...dragProps}
          >
            <img src={Upload} alt="Upload Image" className="upload-icon" />
            {type === "upload"
              ? `Upload ${label}`
              : type === "view"
                ? "Press image to view"
                : `Upload ${label}`}
          </button>}
          &nbsp;
          <SortableList
            onSortEnd={onSortEnd}
            className="images-list"
            draggedItemClassName="dragged-image"
          >
            {imageList.length > 0 &&
              imageList.map((image, index) => (
                <SortableItem key={index}>
                  <div className="image-item-container">
                    <i
                      className="fas fa-times delete-img-icon"
                      onClick={() => onImageRemove(index)}
                    />

                    <img
                      alt="img"
                      className="image-item"
                      onClick={() => {
                        setIsZoomedImage(true);
                        setImage(uploadedImagesList[index].file)
                      }}
                      src={image["data_url"]}
                    />
                  </div>
                </SortableItem>
              ))}

            {type === "edit" &&
              viewList?.length > 0 &&
              viewList.map((item, index) => {
                return (
                  <div key={index} className="image-item-container view-only">
                    <i
                      className="fas fa-times delete-img-icon"
                      onClick={() => onDleteFromCurrent(item)}
                    />
                    <img
                      alt="img"
                      className={"image-item"}
                      onClick={() => {
                        getImage(item);
                      }}
                      src={item?.includes('https://') ? item : `${imageEndPoint}${item}`}
                    />
                  </div>
                );
              })}

            {type === "view" &&
              viewList?.length > 0 &&
              viewList.map((item, index) => {
                return (
                  <div key={index} className="image-item-container view-only">
                    <img
                      alt="img"
                      className={selectedImage === item.Location ? "image-item-selected" : "image-item"}
                      onClick={() => {
                        getImage(item?.Location)
                      }}
                      src={item?.Location}
                    />
                  </div>
                );
              })}
          </SortableList>
        </div>
      )}
    </ImageUploading>
  </>
}
