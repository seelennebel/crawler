import fs from "fs"
import room_IDs from "./data/room_IDs.js";

class json_parser {

// fetch a raw calendar
    async fetch_calendar(date) {
        const options = {
            method: "GET",
            headers: {
                "Teamup-Token": process.env.API_KEY
            }
        };

        const fetch_url = `https://api.teamup.com/${process.env.CALENDAR_KEY}/events?startDate=${date}&endDate=${date}&tz=Europe%2FBerlin`;

        const res = await fetch(fetch_url, options);
        const json = await res.json();
        return json;
    }

// create a file with a "specfic" name
    create_schedule_file(date) {
        fs.open(`./EVENTS/SCHEDULE_events_${date}.csv`, "a", (err, file) => {
            if (err) {
                throw err;
            }
        });
    }

    create_canvas_file(date) {
        fs.open(`./EVENTS/CANVAS_events_${date}.csv`, "a", (err, file) => {
            if (err) {
                throw err;
            }
        });
    }

// append the file
    append_schedule_file(date, contents) {
        fs.appendFile(`./EVENTS/SCHEDULE_events_${date}.csv`, contents, (err, file) => {
            if (err) {
                console.log(err, file);
                throw err;
            }
        });
    }

    append_canvas_file(date, contents) {
        fs.appendFile(`./EVENTS/CANVAS_events_${date}.csv`, contents, (err, file) => {
            if (err) {
                console.log(err, file);
                throw err;
            }
        });
    }

// generates a string to append the file    
    generate_content_SCHEDULE(i, separator, start_date, end_date, title, who, room) {
        return `${i}${separator}"${start_date}-${end_date}"${separator}"${title}\n${who} (${room})"\n`;
    }

    time_string_parser(str) {
        let new_str = "";
        for (let i = 11; i < 16; ++i) {
            new_str = new_str + str[i];
        }
        return new_str;
    }

    generate_content_CANVAS(i, separator, title) {
        return `${i}${separator}"${title}"\n`;
    }

    create_csv_document(date, option, events) {
        if(option != "CANVAS") {
            this.create_schedule_file(date);
            for(let i = 0; i < events.length; ++i) {
                let content = this.generate_content_SCHEDULE(i, process.env.SEPARATOR, events[i].start_time, events[i].end_time, events[i].title, events[i].tutor, events[i].location);
                this.append_schedule_file(date, content);
            }
            return `SCHEDULE_events_${date}.csv`
        }
        else {
            this.create_canvas_file(date);
            for(let i = 0; i < events.length; ++i) {
                let content = this.generate_content_CANVAS(i, process.env.SEPARATOR, events[i].title);
                this.append_canvas_file(date, content);
            }
            return `CANVAS_events_${date}.csv`
        }
    }

    exists(object) {
        if (object == "" || object == " " || object == undefined) {
            return false;
        }
        else {
            return true;
        }
    }

    check_campus_room(event) {

        let room_errors = {
            reservation: "",
            room_name: ""
        }

        let index = 0;

        for (let i = 0; i < room_IDs.rooms.length; ++i) {
            if (event.subcalendar_ids.includes(room_IDs.rooms[i].id) === true) {
                room_errors.reservation = "";
                index = i;
                break;
            }
            else {
                room_errors.reservation = "ERROR";
            }
        }

        let reservation_room_name = room_IDs.rooms[index].room;

        if (event.hasOwnProperty("custom")) {
            if (!event.custom.hasOwnProperty("campus_room_location")) {
                room_errors.room_name = "ERROR";
            }
            else {
                if (event.custom.campus_room_location != reservation_room_name) {
                    room_errors.room_name = "ERROR";
                }
            }
        }

        return room_errors;
    }

// this function can be tried to written with reccursion
no_errors(errors) {
    let value = true;
    let keys = Object.keys(errors);
    for(let i = 0; i < keys.length; ++i) {
        if(keys[i] == "location") {
            let location_errors = errors[keys[i]];
            let location_keys = Object.keys(errors[keys[i]]);
            for(let n = 0; n < location_keys.length; ++n) {
                if(location_errors[location_keys[n]] != "") {
                    value = false;
                }
            }
        }
        else {
            if(errors[keys[i]] != "") {
                value = false;
            }
        }
    }
    return value;
}
    check_errors(event) {
        let errors = {
            location: {
                reservation: "", //room_reservation
                room_name: ""
            },
            tutor: "",
            link: "" //virtual_classroom_link
        };      

        if(event.hasOwnProperty("custom")) {
            errors.location = this.check_campus_room(event)
        }
        else {
            errors.location.reservation = "ERROR";
            errors.location.room_name = "ERROR"
        }

        if (!this.exists(event.who)) {
            errors.tutor = "ERROR";
        }

        if (event.hasOwnProperty("custom")) {
            if (!event.custom.hasOwnProperty("virtual_classroom_link")) {
                errors.link = "ERROR";
            }
        }
        else {
            errors.link = "ERROR";
        }
        return errors;
    }

// checks if an object has a proterty and if this property is undefined
    is_valid(object, property) {
        if(object.hasOwnProperty(property) || object[property] != undefined)
            return true;
        else {
            return false;
        }
    }

// generate the json object with errors
    generate_json(events) {

        let json = {
            "events": []
        };

        const events_list = events.events;

        for(let i = 0; i < events_list.length; ++i) {

            let changed_title = "";
            let campus_room_location = "";
            let virtual_classroom_link = "";

            if(events_list[i].title == "") {
                changed_title = "No title";
            }
            else {
                changed_title = events_list[i].title
            }

            if (events_list[i].hasOwnProperty("custom")) {
                if (this.is_valid(events_list[i].custom, "campus_room_location")) {
                    campus_room_location = events_list[i].custom.campus_room_location;
                }
                else {
                    campus_room_location = "No room location";
                }
                if (this.is_valid(events_list[i].custom, "virtual_classroom_link")) {
                    virtual_classroom_link = events_list[i].custom.virtual_classroom_link;
                }
                else {
                    virtual_classroom_link = "No virtual classroom link";
                }
            }
            
            let checked_errors = this.check_errors(events_list[i]);

            json.events[i] = {
                index: i,
                title: changed_title,
                start_time: this.time_string_parser(events_list[i].start_dt),
                end_time: this.time_string_parser(events_list[i].end_dt),
                tutor: events_list[i].who,
                location: campus_room_location,
                virtual_classroom_link: virtual_classroom_link,
                errors: this.no_errors(checked_errors) ? "" : checked_errors
            }
        }
        return json;
    }
}

export default json_parser;