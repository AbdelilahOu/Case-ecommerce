interface ImageConfig {
  configId: string;
  imageUrl: string;
  imageDimentions: {
    width: number;
    height: number;
  };
}

const CaseDesigner = ({ configId, imageUrl, imageDimentions }: ImageConfig) => {
  return <div></div>;
};

export default CaseDesigner;
