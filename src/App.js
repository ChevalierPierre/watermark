import React, { Component } from 'react'
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



class App extends Component {

onChangeHandler = event => {
    var files = event.target.files
    if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
      
      // if return true allow to setState
      this.setState({
        selectedFile: files
      })
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    }

  }

  onClickHandler = () => {
    const data = new FormData()
    for (var x = 0; x < this.state.selectedFile.length; x++) {
      data.append('file', this.state.selectedFile[x])
    }

    axios.post("http://localhost:8000/upload", data, {
      // receive two    parameter endpoint url ,form data
    })

      .then(res => { // then print response status
        console.log(res.statusText)
      })
      .then(res => {
        toast.success('upload success')
      })
      .catch(err => {
        toast.error('upload fail')
      })

  }

  maxSelectFile = (event) => {
    let files = event.target.files // create file object
    if (files.length > 3) {
      const msg = 'Only 3 images can be uploaded at a time'
      event.target.value = null // discard selected file
      console.log(msg)
      toast.warn(msg)
      return false;

    }
    return true;

  }

  checkMimeType = (event) => {

    let files = event.target.files
    let err = [] // create empty array
    const types = ['image/png', 'image/jpeg', 'image/gif']
    for (var x = 0; x < files.length; x++) {
      if (types.every(type => files[x].type !== type)) {
        err[x] = files[x].type + ' is not a supported format\n';
        // assign message to array
      }
    };
    for (var z = 0; z < err.length; z++) { // loop create toast massage
      event.target.value = null
      toast.error(err[z])
    }
    return true;
  }

  checkFileSize = (event) => {
    let files = event.target.files
    let size = 2000000
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + 'is too large, please pick a smaller file\n';
      }
    };
    for (var z = 0; z < err.length; z++) {
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }

/////////////
  /////// Implementation Crypto Stego ////////



  render() {
    return (

      <div class="container">
        <div class="row">
          <div class="offset-md-3 col-md-6">
            <form method="post" action="#" id="#">
              <div class="form-group files">
                <label>Upload Your File </label>
                <input type="file" class="form-control" multiple onChange={this.onChangeHandler} />
              </div>
              <button type="button" class="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>
            </form>
          </div>
        </div>
        <div class="form-group">
          <ToastContainer />
        </div>
      </div>
    );
  }
}

export default App;