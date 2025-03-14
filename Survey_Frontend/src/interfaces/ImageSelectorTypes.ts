export interface Theme {
    title: string;
    image_base64: string;
  }
  
  export interface ImageSelectorProps {
    onImageSelected: (imageUri: string | null) => void;
  }
  