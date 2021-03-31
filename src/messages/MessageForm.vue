<template>
    <div>
        <div class="messageform">

        
          <div class="progress" v-if="uploadState == 'uploading'">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar">{{ uploadLabel }}</div>
          </div>

            <form @submit.prevent="sendMessage">
                <div class="input-group mb-3">
                    <input v-model.trim="message" name="message" id="message" placeholder="Type your question or message" class="form-control mt-3" autofocus>

                    <div class="input-group-append">
                        <button @click="sendMessage" class="btn btn-dark mt-3" type="button">&nbsp; Send &nbsp;</button>
                    </div>

                    <div class="input-group-append">
                        <button @click.prevent="openFileModal" :disabled="uploadState == 'uploading'" class="btn btn-warning mt-3" type="button">Upload</button>
                    </div>
                </div>
            </form>

            
            <file-modal ref="file_modal"></file-modal>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import FileModal from './FileModal'
import uuidV4 from 'uuid/V4'
import storage from 'firebase/storage'
    export default {
        name: 'message-form',
        components: {FileModal},
        data() {
          return {
            message: '',
            errors: [],
            storageRef: firebase.storage().ref(),
            uploadTask: null,
            uploadState: null
          }
        },
        computed: {
          ...mapGetters(['currentChannel', 'currentUser', 'isPrivate']),
         
          uploadLabel() {
            switch(this.uploadState) {
              case 'uploading': return 'Uploading in progress'
                break
              case 'error': return 'Error occured'
                break
              case 'done': return 'Upload completed'
                break
              default: return ''
            }
          }
        },
        methods: {
          sendMessage() {
            if(this.currentChannel !== null) {
              if(this.message.length > 0) {
                this.$parent.getMessagesRef().child(this.currentChannel.id).push().set(this.createMessage())
                .then(() => {
                  this.$nextTick(() => {
                    $("html, body").scrollTop($(document).height());
                  })
                })
                .catch((error) => {
                  this.errors.push(error.message)
                })
                
                this.message = ''
              }
            }
          },
          createMessage(fileUrl = null) {
            
            let message = {
              timestamp: firebase.database.ServerValue.TIMESTAMP,
              user: {
                name: this.currentUser.displayName,
                avatar: this.currentUser.photoURL,
                id: this.currentUser.uid
              }
            }
            if(fileUrl == null) {
            
              message['content'] = this.message
            } else {
             
              message['image'] = fileUrl
            }
            return message
          },
          uploadFile(file, metadata) {
            
            if(file === null) return false
              let pathToUpload = this.currentChannel.id
              let ref = this.$parent.getMessagesRef()
              let filePath = this.getPath() + '/' + uuidV4() + '.jpg'
              this.uploadTask = this.storageRef.child(filePath).put(file, metadata)
              this.uploadState = "uploading"
              
              this.uploadTask.on('state_changed', snapshot => {
                
                let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                $(".progress-bar").css("width", percent+'%')
              }, error => {
                
                this.errors.push(error.message)
                this.uploadState = 'error'
                this.uploadTask = null
            
                this.$refs.file_modal.resetForm()
              }, () => {
               
                this.uploadState = 'done'
                
                this.$refs.file_modal.resetForm()
                
                let fileUrl = this.uploadTask.snapshot.ref.getDownloadURL().then(fileUrl => {
                  this.sendFileMessage(fileUrl, ref, pathToUpload)
                })
              })
          },
          sendFileMessage(fileUrl, ref, pathToUpload) {
            ref.child(pathToUpload).push().set(this.createMessage(fileUrl)).then(() => {
              this.$nextTick(() => {
                $("html, body").scrollTop($(document).height())
              })
            }).catch(error => {
              this.errors.push(error.message)
            })
          },
        
          getPath() {
            if(this.isPrivate) {
              return 'chat/private/'+this.currentChannel.id
            } else {
              return 'chat/public'
            }
          },
          openFileModal() {
            $("#fileModal").appendTo("body").modal('show');
            console.log('openfilemodal')
          }
        },
        mounted() {
          $("html, body").scrollTop($(document).height());
        },
        beforeDestroy() {
          if(this.uploadTask !== null) {
            this.uploadTask.cancel()
            this.uploadTask = null
          }
        }
    }
</script>

<style scoped>
    .messageform {
        position: fixed;
        left:0;
        bottom:0;
        width: 67%;
        z-index:100;
        color:white;
        text-align:center;
        margin-bottom:-20px;
        margin-left:33.3%;
    }
    input, button {
        height:50px;
    }
    .progress {
      margin-bottom: -16px;
    }
</style>