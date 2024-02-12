import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./index.scss";

export default function RecentEvent(props:any): React.ReactElement {
    const moment = require('moment-timezone');
    var currentDate = new Date()
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    var currentDay = currentDate.getDay();
    
    const [render_tag, setRender_tag] = useState<boolean>(false);

    var currntURL = "http://www.google.com/calendar/render?action=TEMPLATE&text=event&dates=[start]/[end]&details=description&location=[location]";
    let group_id = 1846;
    const [event_title, setEvent_title] = useState(null)
    const [description_short, setDescription_short] = useState(null);
    const [start_date, setStart_date] = useState<string>('Initial Value');
    const [end_date, setEnd_date] = useState<string>('Initial Value');
    const [picture, setPicture] = useState<string>('Initial Value');
    const [venue_name, setVenue_name] = useState(null);
    const [venue_address, setVenue_address] = useState(null);
    const [venue_city, setVenue_city] = useState(null);
    const [url, setUrl] = useState<string>('Initial Value');
    const [audience_type, setAudience_type] = useState<string>('Initial Value');
    const [eventUrl, setEvent_URL] = useState<string>("Initial");
    const client = axios.create({
    baseURL: "https://gdsc.community.dev/api/" 
    });

    useEffect(() => {
        const getEvent = async () => {
            const response = await client.get('/chapter/1846/event?status=Published&'+
            'fields=id,title,url,description_short,start_date,end_date,event_type,event_type_title,picture,venue_name,venue_address,venue_city,audience_type,event_tag_title'
            );
            console.log(response.data.results[props.event_num]);
            
            var startTimeStr = response.data.results[props.event_num].start_date;
            var endTimeStr = response.data.results[props.event_num].end_date;
            const originalStart = moment(startTimeStr);
            const originalEnd = moment(endTimeStr);
            const startDateString = originalStart.format("YYYYMMDDTHHmmssSSSZ");
            const startDateShow = originalStart.format('MMMM Do YYYY, h:mm:ss a');
            const endDateString = originalEnd.format("YYYYMMDDTHHmmssSSSZ");
            const endDateShow = originalEnd.format('MMMM Do YYYY, h:mm:ss a');
            var eventYear = endDateString.slice(0, 4);
            var eventMonth = endDateString.slice(4, 6);
            var eventDay = endDateString.slice(6, 8);

            setEvent_title(response.data.results[props.event_num].title);
            setDescription_short(response.data.results[props.event_num].description_short);
            setStart_date(startDateShow);
            setEnd_date(endDateShow);
            setPicture(response.data.results[props.event_num].picture.url);
            setVenue_name(response.data.results[props.event_num].venue_name);
            setVenue_address(response.data.results[props.event_num].venue_address);
            setVenue_city(response.data.results[props.event_num].venue_city);
            setUrl(response.data.results[props.event_num].url);
            if(response.data.results[props.event_num].audience_type=="HYBRID"){
                setAudience_type("實體線上同步");
            }else if(response.data.results[props.event_num].audience_type=="In-person"){
                setAudience_type("實體活動");
            }else {
                setAudience_type("線上活動");
            }

            currntURL = currntURL.replace("event",response.data.results[props.event_num].title)
            .replace("description",response.data.results[props.event_num].description_short)
            .replace("[start]", startDateString)
            .replace("[end]", endDateString)
            .replace("[location]", response.data.results[props.event_num].venue_name)
            ;
            setEvent_URL(currntURL);
            
            if(eventYear>=currentYear){
                if(eventMonth>=currentMonth){
                    if(eventDay>=currentDay){
                        setRender_tag(true);
                        console.log("true")
                    }
                }
            }
        } 
        getEvent();
    },[]);
    const joinClick = () => {
      const ref = url;
      window.open(ref)
    };
    const addtocalendarClick = () => {
      const calendarEvent = eventUrl;
      window.open(calendarEvent)
    }
    
    return (
        
        <div id="recent-event">
            {render_tag ? (
            <div className='recent-event-block'>
                <div className='tag-block'>
                <div className='tag' >Career Development</div>
                <div className='tag' >{audience_type}</div>
                </div>

                <div className='content-block'>
                    <div className='avatar-block'>
                        <img className='avatar' src={picture} ></img>
                    </div>   
                    <div className='string-content-block'>
                    <p className='topic'>{event_title}</p>
                    <p className='time'>{start_date} ~ {end_date}</p>
                    <p className='location'>{venue_name} {venue_city} {venue_address}</p>
                    <p className='introduction'>{description_short}</p>
                    
                    <div className='button-block'>
                        <button className='join' onClick={joinClick}>立即加入</button>
                        <button className='addtocalendar' onClick={addtocalendarClick}>加入行事曆</button>
                    </div>
                    </div>
                </div>
            </div>
            ) : (
                <div className='recent-event-block'>
                    <p className='topic'>No recent events</p>
                </div>
            )}
        </div>
        
    );
}