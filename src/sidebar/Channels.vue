<template>
    <div>
        <button @click="openModal" class="btn btn-outline-success">Add Channel</button>
        <br/>
        <br/>
        <br/>
<h4 class="modal-title text-light">Channels</h4>
      
        <div class="mt-4">
            <button v-for="channel in channels" class="list-group-item list-group-item-action" type="button" :class="{'active': setActiveChannel(channel)}" @click="changeChannel(channel)">{{ channel.name }} <span v-if="getNotification(channel) > 0 && channel.id !== currentChannel.id" class="float-right">{{ getNotification(channel) }}</span></button>
        </div>

    
        <div class="modal fade" id="channelModal">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">

              <div class="modal-header">
                <h5 class="modal-title text-dark">Channel name</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div class="modal-body">
                <form>
                    <div class="form-group">
                        <input v-model="new_channel" type="text" id="new_channel" name="new_channel" placeholder="Channel name" class="form-control">
                    </div>
                
                    <ul class="list-group" v-if="hasErrors">
                        <li class="list-group-item text-danger" v-for="error in errors">{{ error }}</li>
                    </ul>
                </form>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button @click="addChannel" type="button" class="btn btn-success">Add Channel</button>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import database from 'firebase/database'
import {mapGetters} from 'vuex'
import mixin from '../mixins'
    export default {
        name: 'channels',
        data() {
            return {
                new_channel: '',
                errors: [],
                channelsRef: firebase.database().ref('channels'),
                messagesRef: firebase.database().ref('messages'),
                notifCount: [],
                channels: [],
                channel: null
            }
        },
        mixins: [mixin],
        computed: {
            ...mapGetters(['currentChannel', 'isPrivate']),
            hasErrors() {
                return this.errors.length > 0
            }
        },
        watch: {
            isPrivate() {
                if(this.isPrivate) {
                    this.resetNotifications()
                }
            }
        },
        methods: {
            openModal() {
                $('#channelModal').appendTo("body").modal('show');
            },
            
            addChannel() {
                this.errors = []
               
                let key = this.channelsRef.push().key
                console.log('newly creating channel key: ', key)
               
             
                let newChannel = {id: key, name: this.new_channel}
            
                this.channelsRef.child(key).update(newChannel)
                .then(() => {
                    
                    this.$store.dispatch("setCurrentChannel", newChannel)
                    
                    this.new_channel = ''
                    $("#channelModal").modal('hide')
                })
             
                .catch((error) => {
                    this.errors.push(error.message)
                })
            },
            addListeners() {
                this.channelsRef.on('child_added', snapshot => {
                    
                    this.channels.push(snapshot.val())
                   
                    if(this.channels.length > 0) {
                        
                        this.channel = this.channels[0]
                        
                        this.$store.dispatch("setCurrentChannel", this.channel) 
                    }
                   
                    this.addCountListener(snapshot.key)
                })
            },
            addCountListener(channelId) {
                this.messagesRef.child(channelId).on('value', snapshot => {
                    this.handleNotifications(channelId, this.currentChannel.id, this.notifCount, snapshot)
                })
            },
            getNotification(channel) {
                let notif = 0
                this.notifCount.forEach(el => {
                    if(el.id === channel.id) {
                        notif = el.notif
                    }
                })
                return notif
            },
          
            setActiveChannel(channel) {
                return channel.id === this.currentChannel.id
            },
            
            changeChannel(channel) {
               
                this.resetNotifications()
                this.$store.dispatch('setPrivate', false)
                this.$store.dispatch("setCurrentChannel", channel)
                
                this.channel = channel
            },
            
            resetNotifications() {
                let index = this.notifCount.findIndex(el => el.id === this.channel.id)
                if(index !== -1) {
                    this.notifCount[index].total = this.notifCount[index].lastKnownTotal
                    this.notifCount[index].notif = 0
                }
            },
            detachListeners() {
                this.channelsRef.off()
                this.channels.forEach(el => {
                    this.messagesRef.child(el.id).off()
                })
            }
        },
        mounted() {
            this.addListeners()
        },
        beforeDestroy() {
            this.detachListeners()
        }
    }
</script>

