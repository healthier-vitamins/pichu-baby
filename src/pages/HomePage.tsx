import "./HomePage.scss";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { createRef, RefObject, useEffect, useState } from "react";
import GLOBALVARS from "../utils/GLOBALVARS";

import "react-datepicker/dist/react-datepicker.css";
import { axiosTo } from "utils/promise";
import axios from "axios";

function HomePage() {
  const [startDate, setStartDate] = useState(new Date());
  const [isSubmited, setIsSubmited] = useState(false);

  type Payload = {
    MEAL_TYPE: RefObject<string>;
    AMOUNT: RefObject<string>;
    DATE_TIME: Date | null;
    TITLE: RefObject<string>;
  };

  // const refInitialState: RefInitialState = useMemo(() => {
  //   return {
  //     MEAL_TYPE: null,
  //     AMOUNT: null,
  //     DATE_TIME: null,
  //     TITLE: null,
  //   };
  // }, []);

  const refMealType = createRef<any>();
  const refAmount = createRef<any>();

  // function filterDate(date: Date) {
  //   if (moment(date).isBefore(moment(startDate))) {
  //     // if (date.getTime() < startDate.getTime()) {/
  //     return false;
  //   }
  //   return true;
  // }

  function isAnyObjValueEmpty(obj: any) {
    const keys = Object.keys(obj);
    for (let key of keys) {
      if (obj[key] === null) return true;
    }
    return false;
  }

  async function postEntry(payload: any) {
    setIsSubmited(false);
    const [err, res] = await axiosTo(axios.post("api/postEntry", payload));
    console.log("lol", err, res);
    if (err) {
      alert("Something went wrong.");
      return;
    }
    if (res) {
      alert("Successfully added.");
    } else {
      alert("Some fields are empty.");
      setIsSubmited(false);
    }
  }

  useEffect(() => {
    if (isSubmited) {
      if (refMealType.current.value === null)
        refMealType.current.value = GLOBALVARS.MEAL_TYPE[0];
      if (refAmount.current.value === null)
        refAmount.current.value = GLOBALVARS.AMOUNT[0];
      const payload: Payload = {
        AMOUNT: refAmount.current.value,
        DATE_TIME: startDate,
        MEAL_TYPE: refMealType.current.value,
        TITLE: refMealType.current.value,
      };
      if (!isAnyObjValueEmpty(payload)) {
        postEntry(payload);
      }
    }
  }, [isSubmited, startDate, refAmount, refMealType]);

  const RenderMainForm: Function = (): React.ReactElement => {
    return (
      <div className="form-main">
        <Form>
          <div className="form-row">
            <Form.Group>
              <Form.Label className="form-label">Date:&nbsp;</Form.Label>
              <div id="datepicker">
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="MM/dd/yyyy h:mm aa"
                  // filterDate={filterDate}
                ></DatePicker>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Meal Type:&nbsp;</Form.Label>
              <Form.Select
                size="sm"
                ref={refMealType}
                onChange={(e) => {
                  refMealType.current.value = e.target.value;
                }}
              >
                {GLOBALVARS.MEAL_TYPE.map((type: string, index: number) => {
                  return (
                    <option key={index} value={type} defaultChecked>
                      {type}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Amount:&nbsp;</Form.Label>
              <Form.Select
                size="sm"
                ref={refAmount}
                onChange={(e) => {
                  refAmount.current.value = e.target.value;
                }}
              >
                {GLOBALVARS.AMOUNT.map((amnt: string, index: number) => {
                  return (
                    <option key={index} value={amnt}>
                      {amnt}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </div>
        </Form>
        <div className="submit-btn">
          <button onClick={() => setIsSubmited(true)}>Submit</button>
        </div>
      </div>
    );
  };

  return (
    <div className="main">
      <RenderMainForm></RenderMainForm>
      <>
        {/* {console.log(
          startDate.toLocaleString("en-sg", {
            hour12: false,
            timeZone: "Asia/Singapore",
          })
        )} */}
        {/* {console.log(startDate)} */}
      </>
    </div>
  );
}

export default HomePage;
