import "./HomePage.scss";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useEffect, useRef, useState } from "react";
import GLOBALVARS from "../utils/GLOBALVARS";
import { Spinner } from "react-bootstrap";
import pichu from "../assets/pichu3.png";

import "react-datepicker/dist/react-datepicker.css";
import { axiosTo } from "utils/promise";
import axios from "axios";

function HomePage() {
  const [startDate, setStartDate] = useState(new Date());
  const [isSubmited, setIsSubmited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  type Payload = {
    MEAL_TYPE: any;
    AMOUNT: any;
    DATE_TIME: any;
    TITLE: any;
  };

  // const refInitialState: RefInitialState = useMemo(() => {
  //   return {
  //     MEAL_TYPE: null,
  //     AMOUNT: null,
  //     DATE_TIME: null,
  //     TITLE: null,
  //   };
  // }, []);

  const refMealType = useRef<any>();
  const refAmount = useRef<any>();
  const [formData, setFormData] = useState<Payload>({
    AMOUNT: GLOBALVARS.AMOUNT[0],
    DATE_TIME: undefined,
    MEAL_TYPE: GLOBALVARS.MEAL_TYPE[0],
    TITLE: GLOBALVARS.MEAL_TYPE[0],
  });
  // function filterDate(date: Date) {
  //   if (moment(date).isBefore(moment(startDate))) {
  //     // if (date.getTime() < startDate.getsTime()) {/
  //     return false;
  //   }
  //   return true;
  // }

  // function isAnyObjValueEmpty(obj: any) {
  //   const keys = Object.keys(obj);
  //   for (let key of keys) {
  //     if (obj[key] === null) return true;
  //   }
  //   return false;
  // }

  async function postEntry(payload: any) {
    const [err, res] = await axiosTo(axios.post("api/postEntry", payload));
    console.log("lol", err, res);
    if (err) {
      setIsSubmited(false);
      setIsLoading(false);
      alert("Something went wrong.");
      return;
    }
    if (res) {
      setIsSubmited(false);
      setIsLoading(false);
      alert("Successfully added.");
    }
  }

  useEffect(() => {
    if (!isSubmited) setIsLoading(true);
  }, [isSubmited]);

  useEffect(() => {
    if (isSubmited) {
      console.log(
        "refs ||||||| ",
        refAmount.current.value,
        refMealType.current.value
      );
      const payload: Payload = {
        AMOUNT: refAmount.current.value,
        DATE_TIME: startDate,
        MEAL_TYPE: refMealType.current.value,
        TITLE: refMealType.current.value,
      };
      // console.log(startDate);
      // setFormData({ ...formData, DATE_TIME: startDate });
      // console.log(formData);
      postEntry(payload);
    }
  }, [isSubmited, startDate]);

  const RenderMainForm: Function = (): React.ReactElement => {
    return (
      <div className="form-main">
        <Form>
          <div className="form-top">
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
                <Form.Control
                  as={"select"}
                  size="sm"
                  ref={refMealType}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      MEAL_TYPE: e.target.value,
                      TITLE: formData.MEAL_TYPE,
                    });
                  }}
                  value={formData.MEAL_TYPE}
                >
                  {GLOBALVARS.MEAL_TYPE.map((type: string, index: number) => {
                    return (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Amount:&nbsp;</Form.Label>
                <Form.Select
                  size="sm"
                  ref={refAmount}
                  onChange={(e) => {
                    setFormData({ ...formData, AMOUNT: e.target.value });
                  }}
                  value={formData.AMOUNT}
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
            <img className="form-image" src={pichu} alt=""></img>
          </div>
        </Form>
        <>{console.log(isSubmited, isLoading)}</>
        <div className="submit-btn-container">
          <button className="submit-btn" onClick={() => setIsSubmited(true)}>
            {isSubmited && isLoading && (
              <Spinner
                size="sm"
                variant="light"
                className="submit-spinner"
              ></Spinner>
            )}
            Submit
          </button>
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
