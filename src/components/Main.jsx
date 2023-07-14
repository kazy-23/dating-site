import { arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useState } from 'react'
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function Main() {
    const [profiles, setProfiles] = useState(null);
    const [index, setIndex] = useState(0);
    const [end, setEnd] = useState(false);
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);

    //profile editor
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [img, setImg] = useState('');
    const [missing, setMissing] = useState(false);

    //dms
    const [matches, setMatches] = useState([]);
    const [dm, setDm] = useState(null);
    const [contact, setContact] = useState(null);
    const [info, setInfo] = useState('');

    const loadProfiles = async()=>{
        setLoading(false);
        const q = query(collection(db, 'users'));
        const snap = await getDocs(q);
        let list = [];
        snap.forEach((doc)=>{
            list.push(doc.data());
        })

        //Filter out the already viewed
        const s = await getDoc(doc(db, 'users', user.uid));
        let data = s.data();
        let viewed = [];
        if(data.ignored !== undefined && data.liked !== undefined)viewed = data.ignored.concat(data.liked.concat([user.uid]));
        else if(data.ignored !== undefined)viewed = data.liked.concat([user.uid]);
        else if(data.liked !== undefined)viewed = data.ignored.concat([user.uid]);
        else viewed = [user.uid];
        list = list.filter(n => !viewed.includes(n.id));
        if(index > list.length-1)setEnd(true);
        setProfiles(list);
        setName(data.name);
        setDesc(data.desc);
        setImg(data.img);
    }

    if(profiles == null && loading)loadProfiles();

    const ignore = ()=>{
        updateDoc(doc(db, 'users', user.uid), {
            ignored: arrayUnion(profiles[index].id),
        })
        if(index > profiles.length-2)setEnd(true);
        setIndex(index + 1);
    }

    const like = ()=>{
        updateDoc(doc(db, 'users', user.uid), {
            liked: arrayUnion(profiles[index].id),
        })
        if(index > profiles.length-2)setEnd(true);
        setIndex(index + 1);
    }

    const update = ()=>{
        if(name==='' || desc==='' || img===''){
            setMissing(true)
            return;
        }
        updateDoc(doc(db, 'users', user.uid), {
            name: name,
            desc: desc,
            img: img,
        })
    }

    const dms = async()=>{
        setPage(2);

        const s = await getDoc(doc(db, 'users', user.uid));
        let data = s.data();
        let liked = data.liked;
        let list = [];

        const q = query(collection(db, 'users'), where("liked", "array-contains", user.uid), );
        const likes = await getDocs(q);
        likes.forEach((doc)=>{
            let data = doc.data();
            if(liked.includes(data.id)){
                list.push(data);
            }
        })
        setMatches(list);
    }

    const openMatch = async(match)=>{
        setPage(3);
        setDm(match);
        const s = await getDoc(doc(db, 'users', match.id, 'chats', user.uid));
        if(s.exists()){
            setContact(s.data());
        }
        else{
            setContact(null);
        }
    }

    const sendContactInfo = ()=>{
        if(info === '')return;
        setDoc(doc(db, 'users', user.uid, 'chats', dm.id), {
            msg: info
        })
        setInfo('');
    }
    
    return (
        <main>
            <div className='container'>
                {page === 0 ?
                    <header>
                        <p><img src='https://i.imgur.com/KySn6ET.png' alt='Profile' onClick={()=>setPage(1)}/></p>
                        <p><img src='https://i.imgur.com/JYAmuCX.png' alt='Direct Messages' onClick={dms}/></p>    
                    </header>
                :
                    <div className='back'>
                        {page === 3 ? <p><a href='#0' onClick={()=>setPage(2)}>{'<'}</a></p> : <p><a href='#0' onClick={()=>setPage(0)}>{'<'}</a></p>}
                    </div>
                }
                {page===0 &&
                    <div className='swiper'>
                        {!end && profiles && <img src={profiles[index].img} alt='Potential date'/>}
                        <h2>{profiles && !end ? profiles[index].name : "That's it!"}</h2>
                        <p>{profiles && !end ? profiles[index].desc : 'You can talk to your matches by going to direct messages.'}</p>
                        {!end && profiles &&
                            <div>
                                <p><a href='#0' className='button' onClick={ignore} style={{'width': '70%', 'margin': '0', 'backgroundColor': 'red'}}>IGNORE</a></p>
                                <p><a href='#0' className='button' onClick={like} style={{'width': '70%', 'margin': '0', 'backgroundColor': 'green'}}>LIKE</a></p>
                            </div>
                        }
                    </div>
                }
                {page===1 &&
                    <div className='swiper' style={{'textAlign': 'center'}}>
                        <p>Edit profile</p>
                        {missing && <p>All fields must be filled!</p>}
                        <input type='text' placeholder='Image link...' value={img} onChange={(e)=>setImg(e.target.value)}/><br />
                        {img === '' ? <p>No image found.</p> : <img src={img} alt='Profile'/>}
                        <input type='text' placeholder='Name...' value={name} onChange={(e)=>setName(e.target.value)}/><br />
                        <textarea type='text' placeholder='Description...' value={desc} onChange={(e)=>setDesc(e.target.value)}/><br />
                        <a href='#0' className='button' onClick={update}>Save</a>
                    </div>
                }
                {page===2 &&
                    <div>
                        <p style={{'textAlign': 'center'}}>Direct messages</p>
                        {matches.length > 0 ?
                            <div className='chat-list'>
                                {matches.map((match)=>(
                                    <div key={match.id} onClick={()=>openMatch(match)}>
                                        <img src={match.img} alt='Match'/>
                                        {match.name}
                                    </div>
                                ))}
                            </div>
                        :
                            <p>No matches found...</p>    
                        }
                    </div>
                }
                {page===3 &&
                    <div className='swiper'>
                        <img src={dm?.img} alt='Potential date'/>
                        <h2>{dm?.name}</h2>
                        <p>{dm?.desc}</p>
                        <p><b>Contact this person:</b></p>
                        {contact === null ? 
                            <p>
                                <input type='text' placeholder='Instagram/phone nr...' value={info} onChange={(e)=>setInfo(e.target.value)}/><br />
                                <a href='#0' className='button' onClick={sendContactInfo}>Send my contact info</a>
                            </p> 
                        : <p>{contact.msg}</p>}
                    </div>
                }
            </div>
        </main>
    )
}

export default Main