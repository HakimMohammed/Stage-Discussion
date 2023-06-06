import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

import { ReactMic } from "react-mic";
import Avatar from "react-avatar";

import logo from "../assets/images/logo.jpg"

import ClasseMessageChamp from "./ClasseMessageChamp";
import PrivateMessageChamp from "./PrivateMessageChamp";

import instituion from "../assets/images/logo.jpg";

import DiscussionPicture from "./DiscussionPicture";
import UserProfilePicture from "./UserProfilePicture";


export default function Chat() {

    const user = usePage().props.auth.user;
    const type = user.user_type;
    // const joined = user.created_at.split(' ');
    // const joined = user.created_at;$
    const [datePart, timePart] = user.created_at.split(" ");
    const [year, month, day] = datePart.split("-");


    const [discussionC, setDiscussionC] = useState([]);
    const [discussionP, setDiscussionP] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assignedC, setAssignedC] = useState(false);
    const [assignedP, setAssignedP] = useState(false);
    const [classeDiscussionId, setClasseDiscussionId] = useState(0);
    const [discussionclasse, setDiscussionClasse] = useState('');
    const [discussionprivate, setDiscussionPrivate] = useState('');
    const [privateDiscussionId, setPrivateDiscussionId] = useState(0);

    const [searching, setSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [DPsearchResults, setDPSearchResults] = useState([]);
    const [DCsearchResults, setDCSearchResults] = useState([]);
    const [number , setNumber] = useState(0);


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
                // Clean up the script and event listeners if component is unmounted
                script.removeEventListener('load', handleLoad);
                script.removeEventListener('error', handleError);
                document.head.removeChild(script);
            };
        });

        async function fetchData(userType, id) {
            await axios.get(`http://127.0.0.1:8000/api/users/${userType}/${id}/discussions`)
                .then((res) => {
                    console.log(res.data);
                    const listA = res.data.discussionClasses ;
                    const uniqueArray = listA.filter((obj, index, self) => {
                        return index === self.findIndex((el) => el.classe.nom === obj.classe.nom);
                      });

                    setDiscussionC(uniqueArray);
                    const list = res.data.discussionsPrives ;
                    if(type == 'Professeur')
                    {
                        const uniqueArray = list.filter((obj, index, self) => {
                            return index === self.findIndex((el) => el.tuteur.nom === obj.tuteur.nom);
                          });
                        setDiscussionP(uniqueArray);
                    }
                    if(type == 'Tuteur')
                    {
                        const uniqueArray = list.filter((obj, index, self) => {
                            return index === self.findIndex((el) => el.professeur.nom === obj.professeur.nom);
                          });
                        setDiscussionP(uniqueArray);
                    }
                    
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        fetchData(type, user.id);
    }, []);

    const startRecording = () => {
        setAudioSrc('');
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    const handleClick = () => {
        stopRecording();
        setAudioSrc('');
    }

    const onData = (recordedBlob) => {
        // Handle recorded audio data if needed
    };

    const onStop = (recordedBlob) => {
        setAudioSrc(recordedBlob.blobURL);
    };

    


    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        setSearching(true);

        const DCfilteredResults = discussionC.filter((item) =>
            item.classe.nom.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
        setDCSearchResults(DCfilteredResults);

        if(type == 'Tuteur')
        {
            const DPfilteredResults = discussionP.filter((item) => 
                item.professeur.nom.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
                item.professeur.prenom.toLowerCase().startsWith(searchTerm.toLowerCase()) 
        );
        setDPSearchResults(DPfilteredResults);
        }
        if(type == 'Professeur')
        {
            const DPfilteredResults = discussionP.filter((item) => 
            item.tuteur.nom.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
            item.tuteur.prenom.toLowerCase().startsWith(searchTerm.toLowerCase()) 
        );
        setDPSearchResults(DPfilteredResults);
        }
    };


    // return (
    //     <div className="h-screen w-screen">
    //         <nav class="bg-white h-[7%] border-b-2 border-gray-300">
    //             <img src={logo} className="h-16" />
    //         </nav>
    //         <div class="flex flex-row w-full h-[93%]">
    //             <aside class="bg-[#ffbf81] w-[20%] border-r-4 border-gray-300">
    //                 <div class="p-4 h-[49%] ">
    //                     <h1 class="text-xl mb-4 text-center text-white border-b-3 border-white">Classes</h1>
    //                     <hr className="border-2 rounded border-white"></hr>
    //                     {/* <!-- Dropdown list for classes --> */}
    //                     <div class="flex flex-col space-y-4 overflow-y-auto scrollbar-hide h-[90%]">
    //                         {
    //                             discussionC.map((discussion) => {
    //                                 return (
    //                                     <button onClick={() => {
    //                                         setAssignedP(false)
    //                                         setClasseDiscussionId(discussion.idDiscussionClasse)
    //                                         setAssignedC(true)
    //                                     }} class="bg-[#ffdc5e] text-white rounded-lg px-4 py-2">{discussion.classe.nom}</button>
    //                                 )
    //                             })
    //                         }
    //                     </div>
    //                 </div>
    //                 <hr className="border-2 rounded border-white"></hr>
    //                 <div class="p-4 h-[50%]">
    //                     {type == 'Tuteur' && <h2 class="ext-xl mb-4 text-center text-white border-b-3 border-white">Professeurs</h2>}
    //                     {type == 'Professeur' && <h2 class="ext-xl mb-4 text-center text-white border-b-3 border-white">Tuteurs</h2>}

    //                     <hr className="border-2 rounded border-white"></hr>
    //                     {/* <!-- Dropdown list for professors --> */}
    //                     <div class="flex flex-col space-y-4 overflow-y-auto scrollbar-hide h-[94%]">
    //                         {
    //                             discussionP.map((discussion) => {
    //                                 return (
    //                                     <button onClick={() => {
    //                                         setAssignedC(false)
    //                                         setPrivateDiscussionId(discussion.idDiscussionPrive)
    //                                         setAssignedP(true)
    //                                     }} class="bg-[#ffdc5e] text-white rounded-lg px-4 py-2">
    //                                         {type == 'Professeur' && `${discussion.tuteur.nom} ${discussion.tuteur.prenom}`}
    //                                         {type == 'Tuteur' && `${discussion.professeur.nom} ${discussion.professeur.prenom}`}
    //                                     </button>
    //                                 )
    //                             })
    //                         }
    //                     </div>
    //                 </div>
    //             </aside>

    //             {assignedC && <ClasseMessageChamp idDiscussion={classeDiscussionId} loggedID={user.id} loggedType={type} />}
    //             {assignedP && <PrivateMessageChamp idDiscussion={privateDiscussionId} loggedID={user.id} loggedType={type} />}
    //             {!assignedC && !assignedP &&
    //                 <main class="flex-1 h-full w-[85%]">
    //                     <div class="h-[90%] overflow-y-auto w-full p-4 bg-white scrollbar-hide" id="messages_champ" >
    //                         {/* <!-- Messages --> */}
    //                         <h1 className="text-center">Choisir une discussion pour afficher ses messages ...</h1>
    //                     </div>

    //                     <div class="h-[10%] w-full p-4 pt-5 border-t-4 bg-[#ffbf81]">
    //                         {/* <!-- Message form --> */}
    //                         <form class="flex">
    //                             <input type="text" disabled placeholder="Type your message..." class="flex-1 rounded-l-lg px-4 py-2" />
    //                             <button type="submit" disabled class="bg-orange-400 text-white rounded-r-lg px-4 py-2">Envoyer</button>
    //                         </form>
    //                     </div>
    //                 </main>}
    //         </div>
    //     </div>
    // )

    return (
        <div class="main-wrapper">
            <div class="page-wrapper">
                <div class="page-content">
                    <div class="row chat-wrapper">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row position-relative">
                                        <div class="col-lg-4 chat-aside border-end-lg">
                                            <div class="aside-content">
                                                <div class="aside-header">
                                                    <div
                                                        class="d-flex justify-content-between align-items-center pb-2 mb-2">
                                                        <div class="d-flex align-items-center">
                                                            <figure class="me-2 mb-0">
                                                                <UserProfilePicture name={`${user.nom} ${user.prenom}`} />
                                                            </figure>
                                                            <div>
                                                                <h6>{`${user.nom} ${user.prenom}`}</h6>
                                                                <p class="text-muted tx-13">{`Joined ${year}/${month}`}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <form class="search-form">
                                                        <div class="input-group">
                                                            <span class="input-group-text">
                                                                <i data-feather="search" class="cursor-pointer"></i>
                                                            </span>
                                                            <input type="text" class="form-control" value={searchTerm} onChange={handleSearch} id="searchForm" placeholder="Search here..." />
                                                        </div>
                                                    </form>
                                                </div>
                                                <div class="aside-body">
                                                    <ul class="nav nav-tabs nav-fill mt-3" role="tablist">
                                                        <li class="nav-item">
                                                            <a class="nav-link active" id="chats-tab" data-bs-toggle="tab"
                                                                data-bs-target="#chats" role="tab" aria-controls="chats"
                                                                aria-selected="true">
                                                                <div
                                                                    class="d-flex flex-row flex-lg-column flex-xl-row align-items-center justify-content-center">
                                                                    <i data-feather="message-square"
                                                                        class="icon-sm me-sm-2 me-lg-0 me-xl-2 mb-md-1 mb-xl-0"></i>
                                                                    {type == 'Professeur' && <p class="d-none d-sm-block">Parents</p>}
                                                                    {type == 'Tuteur' && <p class="d-none d-sm-block">Profeseeurs</p>}
                                                                </div>
                                                            </a>
                                                        </li>
                                                        <li class="nav-item">
                                                            <a class="nav-link" id="contacts-tab" data-bs-toggle="tab"
                                                                data-bs-target="#contacts" role="tab"
                                                                aria-controls="contacts" aria-selected="false">
                                                                <div
                                                                    class="d-flex flex-row flex-lg-column flex-xl-row align-items-center justify-content-center">
                                                                    <i data-feather="users"
                                                                        class="icon-sm me-sm-2 me-lg-0 me-xl-2 mb-md-1 mb-xl-0"></i>
                                                                    <p class="d-none d-sm-block">Classes</p>
                                                                </div>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    <div class="tab-content mt-3">
                                                        <div class="tab-pane fade show active" id="chats" role="tabpanel"
                                                            aria-labelledby="chats-tab">
                                                            <div>
                                                                <p class="text-muted mb-1">Recent chats</p>
                                                                <ul class="list-unstyled chat-list px-1">
                                                                    {searching &&
                                                                        DPsearchResults.map((discussion) => {
                                                                            return (
                                                                                <li class="chat-item pe-1">
                                                                                    <a href="javascript:;"
                                                                                        class="d-flex align-items-center"
                                                                                        onClick={() => {
                                                                                            setNumber(number+1);
                                                                                            setAssignedC(false)
                                                                                            setDiscussionPrivate(discussion)
                                                                                            setAssignedP(true)
                                                                            

                                                                                        }}
                                                                                    >
                                                                                        <figure class="mb-0 me-2">
                                                                                            {type == 'Professeur' && <DiscussionPicture name={`${discussion.tuteur.nom} ${discussion.tuteur.prenom}`} />}
                                                                                            {type == 'Tuteur' && <DiscussionPicture name={`${discussion.professeur.nom} ${discussion.professeur.prenom}`} />}

                                                                                        </figure>
                                                                                        <div
                                                                                            class="d-flex justify-content-between flex-grow-1 border-bottom">
                                                                                            <div>
                                                                                                <p class="text-body fw-bolder">
                                                                                                    {type == 'Professeur' && `${discussion.tuteur.nom} ${discussion.tuteur.prenom}`}
                                                                                                    {type == 'Tuteur' && `${discussion.professeur.nom} ${discussion.professeur.prenom}`}
                                                                                                </p>
                                                                                                <p class="text-muted tx-13">The Last Message</p>
                                                                                            </div>
                                                                                            <div class="d-flex align-items-end text-body">
                                                                                                <i data-feather="message-square"
                                                                                                    class="icon-md text-primary me-2"></i>
                                                                                                <i data-feather="phone-call"
                                                                                                    class="icon-md text-primary me-2"></i>
                                                                                            </div>
                                                                                        </div>
                                                                                    </a>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                    {!searching &&
                                                                        discussionP.map((discussion) => {
                                                                            return (
                                                                                <li class="chat-item pe-1">
                                                                                    <a href="javascript:;"
                                                                                        class="d-flex align-items-center"
                                                                                        onClick={() => {
                                                                                            setNumber(number+1);
                                                                                            setAssignedC(false)
                                                                                            setDiscussionPrivate(discussion)
                                                                                            setAssignedP(true)

                                                                                        }}
                                                                                    >
                                                                                        <figure class="mb-0 me-2">
                                                                                            {type == 'Professeur' && <DiscussionPicture name={`${discussion.tuteur.nom} ${discussion.tuteur.prenom}`} />}
                                                                                            {type == 'Tuteur' && <DiscussionPicture name={`${discussion.professeur.nom} ${discussion.professeur.prenom}`} />}

                                                                                        </figure>
                                                                                        <div
                                                                                            class="d-flex justify-content-between flex-grow-1 border-bottom">
                                                                                            <div>
                                                                                                <p class="text-body fw-bolder">
                                                                                                    {type == 'Professeur' && `${discussion.tuteur.nom} ${discussion.tuteur.prenom}`}
                                                                                                    {type == 'Tuteur' && `${discussion.professeur.nom} ${discussion.professeur.prenom}`}
                                                                                                </p>
                                                                                                <p class="text-muted tx-13">The Last Message</p>
                                                                                            </div>
                                                                                            <div class="d-flex align-items-end text-body">
                                                                                                <i data-feather="message-square"
                                                                                                    class="icon-md text-primary me-2"></i>
                                                                                                <i data-feather="phone-call"
                                                                                                    class="icon-md text-primary me-2"></i>
                                                                                            </div>
                                                                                        </div>
                                                                                    </a>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div class="tab-pane fade" id="contacts" role="tabpanel"
                                                            aria-labelledby="contacts-tab">
                                                            <p class="text-muted mb-1">Tous les classes</p>
                                                            <ul class="list-unstyled chat-list px-1">
                                                                {searching &&
                                                                    DCsearchResults.map((discussion) => {
                                                                        return (
                                                                            <li class="chat-item pe-1">
                                                                                <a href="javascript:;"
                                                                                    class="d-flex align-items-center"
                                                                                    onClick={() => {
                                                                                        setNumber(number+1);
                                                                                        setAssignedP(false)
                                                                                        setDiscussionClasse(discussion)
                                                                                        setAssignedC(true)
                                                                                    }}>
                                                                                    <figure class="mb-0 me-2">
                                                                                        <DiscussionPicture name={discussion.classe.nom} />
                                                                                    </figure>
                                                                                    <div
                                                                                        class="d-flex align-items-center justify-content-between flex-grow-1 border-bottom">
                                                                                        <div>
                                                                                            <p class="text-body fw-bolder">{discussion.classe.nom}</p>
                                                                                            <p class="text-muted tx-13">{`Mme ${discussion.professeur.nom} ${discussion.professeur.prenom}`}</p>

                                                                                        </div>
                                                                                        <div class="d-flex align-items-end text-body">
                                                                                            <i data-feather="message-square"
                                                                                                class="icon-md text-primary me-2"></i>
                                                                                            <i data-feather="phone-call"
                                                                                                class="icon-md text-primary me-2"></i>
                                                                                        </div>
                                                                                    </div>
                                                                                </a>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                                {!searching &&
                                                                    discussionC.map((discussion) => {
                                                                        return (
                                                                            <li class="chat-item pe-1">
                                                                                <a href="javascript:;"
                                                                                    class="d-flex align-items-center"
                                                                                    onClick={() => {
                                                                                        setNumber(number+1);
                                                                                        setAssignedP(false)
                                                                                        setDiscussionClasse(discussion)
                                                                                        setAssignedC(true)
                                                                                    }}>
                                                                                    <figure class="mb-0 me-2">
                                                                                        <DiscussionPicture name={discussion.classe.nom} />
                                                                                    </figure>
                                                                                    <div
                                                                                        class="d-flex align-items-center justify-content-between flex-grow-1 border-bottom">
                                                                                        <div>
                                                                                            <p class="text-body fw-bolder">{discussion.classe.nom}</p>
                                                                                            <p class="text-muted tx-13">{`Mme ${discussion.professeur.nom} ${discussion.professeur.prenom}`}</p>

                                                                                        </div>
                                                                                        <div class="d-flex align-items-end text-body">
                                                                                            <i data-feather="message-square"
                                                                                                class="icon-md text-primary me-2"></i>
                                                                                            <i data-feather="phone-call"
                                                                                                class="icon-md text-primary me-2"></i>
                                                                                        </div>
                                                                                    </div>
                                                                                </a>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {!assignedC && !assignedP &&
                                            <div class="col-lg-8 chat-content d-flex align-items-center justify-content-center" style={{ height: '77vh' }}>
                                                <img src={instituion} style={{ height: '80%' }} />
                                            </div>
                                        }
                                        {assignedC && <ClasseMessageChamp key={number} discussion={discussionclasse} loggedID={user.id} loggedType={type} />}
                                        {assignedP && <PrivateMessageChamp key={number} discussion={discussionprivate} loggedID={user.id} loggedType={type} />}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
