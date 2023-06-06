import { useEffect, useState } from "react";
import axios from "axios";

import { ReactMic } from "react-mic";

import play from '../assets/play-circle.svg';
import stop from '../assets/stop-circle.svg';

import '../../../css/Test.css';
import "../../bootstrap";

import ChatProfilePicture from "./ChatProfilePicture";
import DiscussionPicture from "./DiscussionPicture";

import instituion from "../assets/images/logo.jpg";


function getSendTime() {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours %= 12;
    hours = hours || 12;

    // Add leading zero to minutes if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Return the formatted time string
    return `${hours}:${formattedMinutes} ${ampm}`;
}

export default function ClasseMessageChamp(props) {

    // Getting Data From props
    const classe = props.discussion.classe;
    const idDiscussion = props.discussion.idDiscussionClasse;
    const loggedIn = props.loggedID;
    const loggedType = props.loggedType;

    // States
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);
    const [contenu, setContenu] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [audioSrc, setAudioSrc] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [currentTime, setCurrentTime] = useState(getSendTime());
    const [msgType, setMsgType] = useState('text');
    const [audio, setAudio] = useState();

    console.log(`Message Type : ${msgType}`);
    console.log(`Contenu : ${contenu}`);
    console.log(contenu);
    console.log(`Audio Source : ${audioSrc}`);

    const startRecording = () => {
        setAudioSrc('');
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    const handleClick = () => {
        isClicked ? setIsClicked(false) : setIsClicked(true);
        if (msgType == 'text') {
            setMsgType('audio');
        }
        if (msgType == 'audio') {
            setMsgType('text');
        }
    };

    const onData = (recordedBlob) => {
        // setContenu(recordedBlob);
    };

    const onStop = (recordedBlob) => {
        setAudio(recordedBlob.blob)
        setAudioSrc(recordedBlob.blobURL);
        setContenu(recordedBlob.blobURL);
    };

    const getFormattedTime = (dateString) => {
        const dateObj = new Date(dateString);
        const currentDate = new Date();
        let formattedTime = '';

        if (isSameDate(dateObj, currentDate)) {
            formattedTime = formatTime(dateObj);
        } else if (isYesterday(dateObj, currentDate)) {
            formattedTime = 'Yesterday';
        } else {
            formattedTime = formatDate(dateObj);
        }

        return formattedTime;
    }

    const isSameDate = (date1, date2) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    }

    const isYesterday = (date, currentDate) => {
        const yesterday = new Date(currentDate.getTime() - 86400000); // Subtract 1 day (24 hours)

        return isSameDate(date, yesterday);
    }

    const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        hours %= 12;
        hours = hours || 12;

        // Add leading zero to minutes if needed
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        // Return the formatted time string
        return `${hours}:${formattedMinutes} ${ampm}`;
    }

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Add leading zero to day and month if needed
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        // Return the formatted date string
        return `${formattedDay}/${formattedMonth}/${year} ${formatTime(date)}`;
    }

    const handleMessageReceived = (data) => {

        const date = new Date();

        if (data.user.user_type == 'Professeur') {

            const newMessage = {
                created_at: date,
                professeur_id: data.user.id,
                tuteur_id: 0,
                type : data.msgType ,
                contenu: data.message
            };

            console.log(newMessage);

            setMessages((messages) => [...messages, newMessage]);

        }
        if (data.user.user_type == 'Tuteur') {
            const newMessage = {
                created_at: date,
                professeur_id: 0,
                tuteur_id: data.user.id,
                type : data.msgType ,
                contenu: data.message
            };

            console.log(newMessage);


            setMessages((messages) => [...messages, newMessage]);
        }
    };

    const Call = () => {
        axios.post('/api/call')
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err.response);
            });
    }

    useEffect(() => {

        const paths = ['../assets/vendors/core/core.js', '../assets/vendors/feather-icons/feather.min.js', '../assets/js/template.js', '../assets/js/chat.js'];

        paths.map((element) => {
            const script = document.createElement('script');
            script.src = element;
            script.async = true;

            const handleLoad = () => {
                console.log('Script loaded');
            };

            const handleError = () => {
                console.error('Error loading script');
            };

            script.addEventListener('load', handleLoad);
            script.addEventListener('error', handleError);

            document.head.appendChild(script);

            return () => {
                script.removeEventListener('load', handleLoad);
                script.removeEventListener('error', handleError);
                document.head.removeChild(script);
            };
        });

        // get Classe Messages ----------------------------------------------------------
        async function fetchData(id) {
            await axios.get(`http://127.0.0.1:8000/api/classe-messages/${id}`)
                .then((res) => {
                    console.log('Fetching Data ...');
                    setMessages(res.data.messages);
                    setUsers(res.data.users);
                    console.log(res.data.messages[5]);
                })
                .catch((err) => {
                    console.log(err.data);
                });
            setLoading(false);
        }
        fetchData(idDiscussion);
        // ---------------------------------------------------------------------------------------


        // Broadcasting -----------------------------------------------------------------------------
        const channel = window.Echo.private(`classe_discussion_${idDiscussion}`);

        channel.listen('sendClasseMessageEvent', (data) => {
            console.log('Event launched !');
            console.log(data);
            handleMessageReceived(data);
        });

        const interval = setInterval(() => {
            setCurrentTime(getSendTime());
        }, 1000);

        return () => {
            channel.stopListening(`classe_discussion_${idDiscussion}`);
            clearInterval(interval);

        };
        //-----------------------------------------------------------------------------------------

    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (msgType == 'text') {
            await axios.post('http://127.0.0.1:8000/api/classe-message/send', { loggedIn, loggedType, idDiscussion, contenu, msgType })
                .then((res) => {
                    console.log(res.data.message);
                })
                .catch((err) => {
                    console.log(err.response);
                });

            document.getElementById('messages_champ').innerHTML += `
        <li class="message-item me">
            <div class="content">
               <div class="message">
                   <div class="bubble">
                       <p>${contenu}</p>
                   </div>
                   <span>${currentTime}</span>
               </div>
           </div>
       </li>`;
        }

        if (msgType == 'audio') {
            console.log('You are sending an audio');

            const formData = new FormData();
            formData.append('audio', audio);
            formData.append('loggedIn', loggedIn);
            formData.append('loggedType', loggedType);
            formData.append('idDiscussion', idDiscussion);
            formData.append('msgType', msgType);

            await axios.post('http://127.0.0.1:8000/api/classe-message/send', formData)
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    console.log(err.response);
                });

            document.getElementById('messages_champ').innerHTML += `
        <li class="message-item me">
            <div class="content">
               <div class="message">
                    <audio src=${contenu} controls className='custom-recorder flex-grow-1 chat-custom-audio' />
                   <span>${currentTime}</span>
               </div>
           </div>
       </li>`;
        }
        setContenu('');
        setIsClicked(false);
        setAudioSrc('');
    }
    return (
        <div class="col-lg-8 chat-content">
            <div class="chat-header border-bottom pb-2">
                <div class="d-flex justify-content-between">
                    <div class="d-flex align-items-center">
                        <i data-feather="corner-up-left" id="backToChatList"
                            class="icon-lg me-2 ms-n2 text-muted d-lg-none"></i>
                        <figure class="mb-0 me-2">
                            <DiscussionPicture name={classe.nom} />
                        </figure>
                        <div>
                            <p>{classe.nom}</p>
                            <p class="text-muted tx-13">{`Mme ${props.discussion.professeur.nom} ${props.discussion.professeur.prenom}`}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center me-n1">
                        <button class=" me-0 me-sm-3 btn btn-icon rounded ms-2" style={{ borderColor: 'white' }} data-bs-toggle="tooltip" data-bs-title="Start voice call" onClick={Call}>
                            <i data-feather="phone-call" class="icon-lg text-muted"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="chat-body">
                {loading &&
                    <div class="d-flex align-items-center justify-content-center" style={{ height: '63vh' }}>
                        <img src={instituion} style={{ height: '60%' }} />
                    </div>
                }
                {!loading &&
                    <ul class="messages" id="messages_champ" style={{ height: '63vh' }}>
                        {
                            messages.map((message) => {
                                const date = getFormattedTime(message.created_at);

                                if(message.type == 'text')
                                {
                                    if (loggedType == 'Tuteur') {
                                        if (message.professeur_id !== 0) {
                                            const messageSender = users.find((user) => user.id == message.professeur_id);
                                            return (
                                                <li class="message-item friend">
                                                    <figure className="me-2">
                                                        <ChatProfilePicture name={`${messageSender.nom} ${messageSender.prenom}`} />
    
                                                    </figure>                                            <div class="content">
                                                        <div class="message">
                                                            <div class="bubble">
                                                                <p>{message.contenu}</p>
                                                            </div>
                                                            <span>{date}</span>
                                                        </div>
                                                    </div>
                                                </li>
    
                                            )
                                        }
                                        else {
                                            if (message.tuteur_id == loggedIn) {
    
                                                return (
                                                    <li class="message-item me">
                                                        <div class="content">
                                                            <div class="message">
                                                                <div class="bubble">
                                                                    <p>{message.contenu}</p>
                                                                </div>
                                                                <span>{date}</span>
                                                            </div>
                                                        </div>
                                                    </li>
    
                                                )
                                            }
                                            else {
                                                const messageSender = users.find((user) => user.id == message.tuteur_id);
                                                return (
                                                    <li class="message-item friend">
                                                        <figure className="me-2">
                                                            <ChatProfilePicture name={`${messageSender.nom} ${messageSender.prenom}`} />
    
                                                        </figure>
                                                        <div class="content">
                                                            <div class="message">
                                                                <div class="bubble">
                                                                    <p>{message.contenu}</p>
                                                                </div>
                                                                <span>{date}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            }
                                        }
                                    }
                                    if (loggedType == 'Professeur') {
                                        if (message.professeur_id !== 0) {
                                            return (
                                                <li class="message-item me">
                                                    <div class="content">
                                                        <div class="message">
                                                            <div class="bubble">
                                                                <p>{message.contenu}</p>
                                                            </div>
                                                            <span>{date}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        }
                                        else {
                                            const messageSender = users.find((user) => user.id == message.tuteur_id);
                                            return (
                                                <li class="message-item friend">
                                                    <figure className="me-2">
                                                        <ChatProfilePicture name={`${messageSender.nom} ${messageSender.prenom}`} />
    
                                                    </figure>
                                                    <div class="content">
                                                        <div class="message">
                                                            <div class="bubble">
                                                                <p>{message.contenu}</p>
                                                            </div>
                                                            <span>{date}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        }
                                    }
                                }
                                if(message.type == 'audio')
                                {
                                    if (loggedType == 'Tuteur') {
                                        if (message.professeur_id !== 0) {
                                            const messageSender = users.find((user) => user.id == message.professeur_id);
                                            return (
                                                <li class="message-item friend">
                                                    <figure className="me-2">
                                                        <ChatProfilePicture name={`${messageSender.nom} ${messageSender.prenom}`} />
    
                                                    </figure>                                            <div class="content">
                                                        <div class="message">
                                                            <div >
                                                                <audio src={`records/${message.contenu}`} controls className='custom-recorder flex-grow-1 chat-rec-custom-audio' />
                                                                {/* <p>{message.contenu}</p> */}
                                                            </div>
                                                            <span>{date}</span>
                                                        </div>
                                                    </div>
                                                </li>
    
                                            )
                                        }
                                        else {
                                            if (message.tuteur_id == loggedIn) {
    
                                                return (
                                                    <li class="message-item me">
                                                        <div class="content">
                                                            <div class="message">
                                                                <div >
                                                                <audio src={`records/${message.contenu}`} controls className='custom-recorder flex-grow-1 chat-custom-audio' />
                                                                </div>
                                                                <span>{date}</span>
                                                            </div>
                                                        </div>
                                                    </li>
    
                                                )
                                            }
                                            else {
                                                const messageSender = users.find((user) => user.id == message.tuteur_id);
                                                return (
                                                    <li class="message-item friend">
                                                        <figure className="me-2">
                                                            <ChatProfilePicture name={`${messageSender.nom} ${messageSender.prenom}`} />
    
                                                        </figure>
                                                        <div class="content">
                                                            <div class="message">
                                                                <div >
                                                                <audio src={`records/${message.contenu}`} controls className='custom-recorder flex-grow-1 chat-rec-custom-audio' />
                                                                </div>
                                                                <span>{date}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            }
                                        }
                                    }
                                    if (loggedType == 'Professeur') {
                                        if (message.professeur_id !== 0) {
                                            return (
                                                <li class="message-item me">
                                                    <div class="content">
                                                        <div class="message">
                                                            <div >
                                                            <audio src={`records/${message.contenu}`} controls className='custom-recorder flex-grow-1 chat-custom-audio' />
                                                            </div>
                                                            <span>{date}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        }
                                        else {
                                            const messageSender = users.find((user) => user.id == message.tuteur_id);
                                            return (
                                                <li class="message-item friend">
                                                    <figure className="me-2">
                                                        <ChatProfilePicture name={`${messageSender.nom} ${messageSender.prenom}`} />
    
                                                    </figure>
                                                    <div class="content">
                                                        <div class="message">
                                                            <div >
                                                            <audio src={`records/${message.contenu}`} controls className='custom-recorder flex-grow-1 chat-rec-custom-audio' />
                                                            </div>
                                                            <span>{date}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        }
                                    } 
                                }
                            })
                        }
                    </ul>
                }
            </div>
            <div class="chat-footer d-flex">
                <div class="d-flex">
                    <button type="button" class="btn border btn-icon rounded-circle me-2" data-bs-toggle="tooltip" data-bs-title="Record you voice" onClick={handleClick}>
                        <i data-feather="mic" class="text-muted"></i>
                    </button>
                </div>
                <form class="search-form flex-grow-1 me-2" style={{ marginBottom: 0 }} onSubmit={handleSubmit}>
                    {isClicked && (
                        <div className='d-flex'>
                            <button type="button" class="btn border btn-icon rounded-circle me-2" data-bs-toggle="tooltip" data-bs-title="Record you voice" onClick={isRecording ? stopRecording : startRecording}>
                                <img src={isRecording ? stop : play} />
                            </button>
                            {
                                !audioSrc && (
                                    <ReactMic
                                        className='form-control rounded-pill custom-recorder'
                                        record={isRecording}
                                        onStop={onStop}
                                        onData={onData}
                                        strokeColor="#0d6efd"
                                        backgroundColor="#FFFFFF"
                                    />
                                )
                            }
                            {audioSrc && (
                                <audio src={audioSrc} controls className='custom-recorder flex-grow-1 custom-audio' />
                            )}
                            <button type="submit" class="btn btn-primary btn-icon rounded-circle ms-2">
                                <i data-feather="send"></i>
                            </button>
                        </div>
                    )}
                    {
                        !isClicked && (
                            <div className="d-flex">
                                <div class="input-group">
                                    <input type="text" class="form-control rounded-pill" value={contenu} onChange={(e) => { setContenu(e.target.value) }} id="chatForm" placeholder="Type a message" />
                                </div>
                                <button type="submit" class="btn btn-primary btn-icon rounded-circle ms-2">
                                    <i data-feather="send"></i>
                                </button>
                            </div>
                        )
                    }
                </form>
            </div>
        </div>
    )
}
