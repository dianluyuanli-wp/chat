import { Upload, Icon, message, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import s from './upload.css';
import Cropper from 'cropperjs';
import $ from 'jquery';
import 'cropperjs/dist/cropper.css';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  // if (!isJPG) {
  //   message.error('You can only upload JPG file!');
  // }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

@inject('chatStore')
@observer
class Avatar extends React.Component {
  state = {
    loading: false,
  };

  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return URL.createObjectURL(new Blob([u8arr], { type: mime }));
  }

  getCropper = () => {
    const image = document.getElementById('image');
    const cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      background: false,  //是否显示网格背景
      zoomable: false,   //是否允许放大图像
      guides: false,   //是否显示裁剪框虚线
      crop: (event) => { //剪裁框发生变化执行的函数。
          const canvas = cropper.getCroppedCanvas({  //使用canvas绘制一个宽和高200的图片
              width: 40,
              height: 40,
          });
          this.avatarBase64 = canvas.toDataURL("image/png", 0.3);
          //  同步父元素的图片数据
          this.props.updateIMg(this.avatarBase64);

          //  预览
          //$('#imga').attr("src", this.avatarBase64)  //使用canvas toDataURL方法把图片转换为base64格式
      }
  });
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      //  setState是异步的，要通过回调的形式来调用cropper
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }, this.getCropper),
      );
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <div>
        <div className={s.uploaderWrapper}>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
          </Upload>
        </div>
        <div className="container">
        </div>
          {/* <div className="preview">
              <img src="" alt="" id="imga" />
          </div> */}
          <div className={s.imgWrapper}><img id='image' src={this.state.imageUrl ? this.state.imageUrl : ''}/></div>
      </div>
    );
  }
}

export default Avatar;