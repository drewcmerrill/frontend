"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";

export function Calculator() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [answer, setAnswer] = useState(69);
  const [result, setResult] = useState<number>();
  const [validEquation, setValidEquation] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [clickedValues, setClickedValues] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);

  const fetchNumbers = () => {
    fetch("/random-numbers")
      .then((res) => res.json())
      .then((data) => {
        setNumbers(data.numbers ?? []);
        setAnswer(data.answer ?? "");
      })
      .catch((err) => console.error(err));

    setUserInput("");
    setClickedValues([]);
    setUsedIndices([]);
    setValidEquation(true);
    setResult(undefined);
  };

  const isEnterEnabled = () => {
    const clickedNumbersCount = numbers.filter((num) =>
      clickedValues.includes(num.toString())
    ).length;

    return clickedNumbersCount === numbers.length;
  };

  const handleItemClick = async (
    value: string,
    isClicked: boolean,
    index: number
  ) => {
    if (value === "Clear") {
      setUserInput("");
      setClickedValues([]);
      setUsedIndices([]);
      setResult(undefined);
      setValidEquation(true);
    } else if (value === "Del") {
      if (clickedValues.length > 0) {
        const lastClickedValue = clickedValues[clickedValues.length - 1];
        const lengthOfLastClicked = -1 * lastClickedValue.toString().length;

        setUserInput((prev) =>
          prev.trimEnd().slice(0, lengthOfLastClicked).trimEnd()
        );

        setClickedValues((prev) => prev.slice(0, -1));
        const lastClickedIsNumber =
          clickedValues.length > 0 &&
          !isNaN(Number(clickedValues[clickedValues.length - 1]));
        if (lastClickedIsNumber) {
          setUsedIndices((prev) => prev.slice(0, -1));
        }
      }
      setResult(undefined);
      setValidEquation(true);
    } else if (value !== "Enter") {
      if (value === ")" || clickedValues[clickedValues.length - 1] === "(") {
        !isClicked && setClickedValues((prev) => [...prev, value]);
        !isClicked && setUserInput((prev) => prev + value);
        if (!isClicked && index < 5) {
          setUsedIndices((prev) => [...prev, index]);
        }
        if (value === "√") {
          setClickedValues((prev) => [...prev, "("]);
          setUserInput((prev) => prev + "(");
        }
      } else {
        !isClicked && setClickedValues((prev) => [...prev, value]);
        !isClicked && setUserInput((prev) => prev + " " + value);
        if (!isClicked && index < 5) {
          setUsedIndices((prev) => [...prev, index]);
        }
        if (value === "√") {
          setClickedValues((prev) => [...prev, "("]);
          setUserInput((prev) => prev + "(");
        }
      }
    } else {
      if (isEnterEnabled()) {
        try {
          const response = await fetch("/submit-answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer: clickedValues }),
          });
          const data = await response.json();
          console.log(data);
          if (data["validString"]) {
            setResult(data["answer"]);
            setValidEquation(true);
          } else {
            setValidEquation(false);
            setResult(undefined);
          }
        } catch (err) {
          console.error("Error submitting answer:", err);
        }
      }
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, []);

  const itemsWithNumbers = items.map((item, idx) => {
    return { ...item, title: numbers[idx] ?? item.title };
  });

  return (
    <div className="max-w-4xl mx-auto flex-col">
      <p
        className={cn(
          "mb-2 text-6xl  text-center",
          answer === 69 ? "invisible" : ""
        )}
      >
        {answer}
      </p>
      <p
        className={cn(
          "mb-2 text-l font-semibold text-center",
          validEquation ? "invisible" : "text-red-400"
        )}
      >
        Invalid Equation
      </p>

      <div className="flex flex-row justify-between">
        <input
          type="text"
          readOnly
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border px-3 py-2 rounded-lg w-[75%] mb-4 "
        />
        <div className="w-[5%] text-center mx-2">
          <p className="mb-4 text-xl font-semibold">=</p>
        </div>

        <div className="w-[20%] text-left">
          <p
            className={cn(
              "mb-4 text-xl font-semibold",
              result !== undefined && result === answer
                ? "text-green-500"
                : "text-red-500"
            )}
          >
            {result !== undefined ? result : ""}
          </p>
        </div>
      </div>

      <BentoGrid className="max-w-4xl mx-auto">
        {itemsWithNumbers.map((item, i) => {
          const value = item.title;
          const isClicked = usedIndices.includes(i);

          return (
            <BentoGridItem
              key={i}
              title={item.title}
              className={cn(
                "[&>p:text-lg] flex justify-center",
                item.className,
                isClicked &&
                  "bg-gray-300 opacity-50 hover:bg-gray-300 active:bg-gray-300",
                value.toString() === "Enter" && !isEnterEnabled()
                  ? "bg-gray-300 opacity-50 hover:bg-gray-300 active:bg-gray-300"
                  : ""
              )}
              onClick={() => handleItemClick(value.toString(), isClicked, i)}
            />
          );
        })}
      </BentoGrid>

      <div className="flex justify-center my-5">
        <button
          onClick={fetchNumbers}
          className={cn(
            "px-4 py-2 rounded-xl border border-neutral-600 text-black bg-white hover:bg-gray-100 active:bg-gray-600 transition duration-200"
          )}
        >
          Refresh Numbers
        </button>
      </div>
    </div>
  );
}

const items = [
  { title: "", className: "col-span-1 h-[3rem]" },
  { title: "", className: "col-span-1 h-[3rem]" },
  { title: "", className: "col-span-1 h-[3rem]" },
  { title: "", className: "col-span-1 h-[3rem]" },
  { title: "", className: "col-span-1 h-[3rem]" },
  { title: "(", className: "col-span-1" },
  { title: ")", className: "col-span-1" },
  { title: "+", className: "col-span-1" },
  { title: "-", className: "md:col-span-1" },
  { title: "/", className: "col-span-1" },
  { title: "×", className: "col-span-1" },
  { title: "√", className: "col-span-1" },
  { title: "^", className: "col-span-1" },
  { title: "Del", className: "col-span-2" },
  { title: "Clear", className: "col-span-2" },
  { title: "Enter", className: "col-span-3" },
];
