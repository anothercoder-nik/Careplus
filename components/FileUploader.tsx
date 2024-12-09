"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

export const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = Array.isArray(files) ? [...files, ...acceptedFiles] : acceptedFiles;
    onChange(newFiles);

    const newPreviews = acceptedFiles.map((file) => convertFileToUrl(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  }, [files, onChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true, // Enable multiple file uploads
  });

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      {previews.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {previews.map((src, index) => (
            <Image
              key={index}
              src={src}
              width={1000}
              height={1000}
              alt={`Uploaded file ${index + 1}`}
              className="max-h-[200px] overflow-hidden object-cover"
            />
          ))}
        </div>
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="upload"
          />
          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-green-500">Click to upload </span>
              or drag and drop
            </p>
            <p className="text-12-regular">
              SVG, PNG, JPG, or GIF (max. 800x400px)
            </p>
          </div>
        </>
      )}
    </div>
  );
};
