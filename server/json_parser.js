import fs from "fs"
import room_IDs from "./data/room_IDs.js";

class json_parser {
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

    create_file(date) {
        fs.open(`./EVENTS/SCHEDULE_events_${date}.csv`, "a", (err, file) => {
            if (err) {
                console.log(err, file);
                throw err;
            }
        });
    }

    append_file(date, contents) {
        fs.appendFile(`./EVENTS/SCHEDULE_events_${date}.csv`, contents, (err, file) => {
            if (err) {
                console.log(err, file);
                throw err;
            }
        });
    }

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

    create_csv_document(date) {
        this.create_file(date);
        this.fetch_calendar(date)
            .then(res => {
                const events = res.events;
                for (let i = 0; i < events.length; ++i) {
                    let start_date = this.time_string_parser(events[i].start_dt);
                    let end_date = this.time_string_parser(events[i].end_dt);

                    let content = this.generate_content_SCHEDULE(i, process.env.OS_SEPARATOR, start_date, end_date, events[i].title, events[i].who, events[i].custom.campus_room_location);
                    this.append_file(date, content);

                }
            });
        return `SCHEDULE_events_${date}.csv`
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
            room_name: "",
            room_reservation: ""
        }

        let index = 0;

        for (let i = 0; i < room_IDs.rooms.length; ++i) {
            if (event.subcalendar_ids.includes(room_IDs.rooms[i].id) === true) {
                room_errors.room_reservation = "";
                index = i;
                break;
            }
            else {
                room_errors.room_reservation = "Error: no room reservation";
            }
        }

        let reservation_room_name = room_IDs.rooms[index].room;

        if (event.hasOwnProperty("custom")) {
            if (!event.custom.hasOwnProperty("campus_room_location")) {
                room_errors.room_name = "Error";
            }
            else {
                if (event.custom.campus_room_location != reservation_room_name) {
                    room_errors.room_name = "Error: room name is not correct";
                }
            }
        }

        return room_errors;
    }

    check_errors(event) {
        let errors = {
            location: {
                room_reservation: "",
                room_name: ""
            },
            tutor: "",
            virtual_classroom_link: ""
        };

        if (event.hasOwnProperty("custom")) {
            if (!event.custom.hasOwnProperty("virtual_classroom_link")) {
                errors.virtual_classroom_link = "Error: virtual classroom link";
            }
        }

        if (!this.exists(event.who)) {
            errors.tutor = "Error: no tutor";
        }

        errors.location = this.check_campus_room(event);

        return errors;
    }

    no_errors(errors) {
        let error = true;
        for (var key in errors) {
            if (key == "location") {
                for (var location_key in errors[key]) {
                    if (errors[key][location_key] !== "") {
                        error = false;
                    }
                }
            }
            else {
                if (errors[key] !== "") {
                    error = false;
                }
            }
            return error;
        }
    }

    create_errors_string(errors) {
        let errors_string = "";
        if (this.no_errors(errors)) {
            errors_string = undefined;
            return errors_string;
        }
        else {
            for (var key in errors) {
                if (key == "location") {
                    for (var location_key in errors[key]) {
                        if (errors[key][location_key] !== "") {
                            errors_string += errors[key][location_key];
                            errors_string += "\n"
                        }
                    }
                }
                else {
                    if (errors[key] !== "") {
                        errors_string += errors[key];
                        errors_string += "\n";
                    }
                }
            }
            return errors_string;
        }
    }

    // generate the json object with errors
    generate_json(events, json_format = false) {

        let json = {
            "events": []
        };

        const res_events = events.events;

        for (let i = 0; i < res_events.length; ++i) {

            let campus_room_location = "";
            let virtual_classroom_link = "";

            if (res_events.hasOwnProperty("custom")) {
                if (res_events.custom.hasOwnProperty("campus_room_location")) {
                    campus_room_location = res_events.custom.campus_room_location;
                }
                if (res_events.custom.hasOwnProperty("virtual_classroom_link")) {
                    virtual_classroom_link = res_events.custom.virtual_classroom_link;
                }
            }

            json.events[i] = {
                index: i,
                title: res_events[i].title,
                start_time: this.time_string_parser(res_events[i].start_dt),
                end_time: this.time_string_parser(res_events[i].end_dt),
                tutor: res_events[i].who,
                location: campus_room_location,
                virtual_classroom_link: virtual_classroom_link,
                errors: this.create_errors_string(this.check_errors(res_events[i]))
            }
        }
        return json;
    }
}

export default json_parser;