import "./HomePage.scss";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useEffect, useRef, useState } from "react";
import GLOBALVARS from "../utils/GLOBALVARS";
import { Spinner } from "react-bootstrap";
import pichu from "../assets/pichu3.png";

import "react-datepicker/dist/react-datepicker.css";

import { getEntryDbIdAndUrl, postEntry } from "utils/apis/apis";

function HomePage() {
  const [startDate, setStartDate] = useState(new Date());
  const [isSubmited, setIsSubmited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dateUrl, setDateUrl] = useState("");

  type Payload = {
    MEAL_TYPE: any;
    AMOUNT: any;
    DATE_TIME: any;
    TITLE: any;
    OTHER_AMOUNT: string;
    OTHER_MEAL_TYPE: string;
  };

  const refMealType = useRef<any>();
  const refOtherMealType = useRef<any>();
  const refAmount = useRef<any>();
  const refOtherAmount = useRef<any>();
  const [formData, setFormData] = useState<Payload>({
    AMOUNT: GLOBALVARS.AMOUNT_FOOD[0],
    DATE_TIME: undefined,
    MEAL_TYPE: GLOBALVARS.MEAL_TYPE[0],
    TITLE: GLOBALVARS.MEAL_TYPE[0],
    OTHER_AMOUNT: "",
    OTHER_MEAL_TYPE: "",
  });
  // function filterDate(date: Date) {
  //   if (moment(date).isBefore(moment(startDate))) {
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

  async function handlePostEntry(payload: any) {
    function succFunc() {
      setIsSubmited(false);
      setIsLoading(false);
      alert("Successfully added.");
      setFormData({
        AMOUNT: GLOBALVARS.AMOUNT_FOOD[0],
        DATE_TIME: undefined,
        MEAL_TYPE: GLOBALVARS.MEAL_TYPE[0],
        TITLE: GLOBALVARS.MEAL_TYPE[0],
        OTHER_AMOUNT: "",
        OTHER_MEAL_TYPE: "",
      });
    }

    function errFunc() {
      setIsSubmited(false);
      setIsLoading(false);
      alert(GLOBALVARS.ERR_MSG_POSTING_ENTRY);
      return;
    }
    postEntry(succFunc, errFunc, payload);
  }

  useEffect(() => {
    handleGetentryDbId();
  }, []);

  async function handleGetentryDbId() {
    const { [GLOBALVARS.DATE_PAGE_URL]: url } = await getEntryDbIdAndUrl();
    setDateUrl(url);
  }

  useEffect(() => {
    if (!isSubmited) setIsLoading(true);
  }, [isSubmited]);

  useEffect(() => {
    if (isSubmited) {
      // console.log(
      //   "refs ||||||| ",
      //   refAmount.current.value,
      //   refMealType.current.value
      // );
      const payload: Payload = {
        AMOUNT: refAmount.current?.value.toUpperCase(),
        DATE_TIME: startDate,
        MEAL_TYPE: refMealType.current.value.toUpperCase(),
        TITLE: refMealType.current.value.toUpperCase(),
        OTHER_AMOUNT: refOtherAmount.current?.value.toUpperCase(),
        OTHER_MEAL_TYPE: refOtherMealType.current?.value.toUpperCase(),
      };
      console.log(payload);
      handlePostEntry(payload);
    }
  }, [isSubmited, startDate]);

  const renderMainForm: Function = (): React.ReactElement => {
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
                <Form.Select
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
                </Form.Select>
                {refMealType.current?.value === "OTHERS" && (
                  <Form.Control
                    className="others-control"
                    size="sm"
                    placeholder="Enter other meal type"
                    ref={refOtherMealType}
                    value={formData.OTHER_MEAL_TYPE}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        OTHER_MEAL_TYPE: e.target.value,
                      })
                    }
                  ></Form.Control>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Label>Amount:&nbsp;</Form.Label>

                {refMealType.current?.value !== "OTHERS" ? (
                  <Form.Select
                    size="sm"
                    ref={refAmount}
                    onChange={(e) => {
                      setFormData({ ...formData, AMOUNT: e.target.value });
                    }}
                    value={formData.AMOUNT}
                  >
                    {refMealType.current?.value &&
                      GLOBALVARS[`AMOUNT_${refMealType.current?.value}`].map(
                        (amnt: string, index: number) => {
                          return (
                            <option key={index} value={amnt}>
                              {amnt}
                            </option>
                          );
                        }
                      )}
                  </Form.Select>
                ) : null}
                {(refMealType.current?.value === "OTHERS" ||
                  refAmount.current?.value === "OTHERS") && (
                  <Form.Control
                    className={
                      refAmount.current?.value === "OTHERS"
                        ? "others-control"
                        : ""
                    }
                    size="sm"
                    placeholder="Enter other amount"
                    ref={refOtherAmount}
                    value={formData.OTHER_AMOUNT}
                    onChange={(e) =>
                      setFormData({ ...formData, OTHER_AMOUNT: e.target.value })
                    }
                  ></Form.Control>
                )}
              </Form.Group>
              <div className="url">
                {dateUrl === "" ? (
                  <Spinner
                    size="sm"
                    variant="secondary"
                    className="submit-spinner"
                  ></Spinner>
                ) : (
                  <a href={dateUrl} target="_blank" rel="noopener noreferrer">
                    Today's entry
                  </a>
                )}
              </div>
            </div>
            <img className="form-image" src={pichu} alt=""></img>
          </div>
        </Form>

        <div className="submit-btn-container">
          <button
            className="submit-btn"
            onClick={() => setIsSubmited(true)}
            disabled={isSubmited}
          >
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

  return <div className="main">{renderMainForm()}</div>;
}

export default HomePage;
