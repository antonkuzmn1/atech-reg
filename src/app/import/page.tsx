'use client';

import * as XLSX from 'xlsx';
import {ChangeEvent, useEffect, useState} from "react";
import {WorkSheet} from "xlsx";
import axios from "axios";
import {useDispatch} from "react-redux";
import {setAppLoading} from "@/store/slices/appSlice";

export interface ImportTableRow {
    number: number;
    inputDate: Date,
    contrAgent: string | number,
    paymentDestination: string | number,
    initiatorOfPayment: string | number,
    sum: string | number,
}

export default function Home() {
    const dispatch = useDispatch();

    const [sheet, setSheet] = useState<WorkSheet>([]);
    const [table, setTable] = useState<ImportTableRow[]>([]);

    const [from, setFrom] = useState<number>(10);
    const [to, setTo] = useState<number>(10);

    const [inputDate, setInputDate] = useState<string>('A');
    const [contrAgent, setContrAgent] = useState<string>('D');
    const [paymentDestination, setPaymentDestination] = useState<string>('F');
    const [initiatorOfPayment, setInitiatorOfPayment] = useState<string>('G');
    const [sum, setSum] = useState<string>('H');

    const [total, setTotal] = useState<number>(0);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (result instanceof ArrayBuffer) {
                    const workbook = XLSX.read(new Uint8Array(result), {type: 'array'});
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    setSheet(sheet);
                } else {
                    console.error('Error: result is not ArrayBuffer.');
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const submit = async () => {
        dispatch(setAppLoading(true));
        console.log(table);
        axios.post('/api/main', {
            table
        }).then((response) => {
            setTotal(response.data.total);
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            dispatch(setAppLoading(false));
        });
    }

    useEffect(() => {
        const newTable: ImportTableRow[] = []
        for (let i = from; i <= to; i++) {
            const getValueOfCell = function (letter: string): string | number {
                try {
                    const value = sheet[letter + i].v;
                    if (value === undefined) return '';
                    else return sheet[letter + i].v;
                } catch (e) {
                    throw new Error('o kurwa')
                }
            };
            const cellToDate = function (inputDate: string): Date {
                try {
                    const dateString: string | number = getValueOfCell(inputDate);
                    if (typeof dateString !== 'string'
                        || dateString === '') throw new Error('o kurwa');
                    const DMY: string[] = dateString.split('.');
                    const day: string = DMY[0];
                    const mon: string = DMY[1];
                    const yer: string = DMY[2];
                    const formattedDateString: string = `${yer}-${mon}-${day}`;
                    return new Date(formattedDateString);
                } catch (e) {
                    throw new Error('o kurwa')
                }
            };
            try {
                const inputDateValue: Date = cellToDate(inputDate);
                const contrAgentValue: string | number = getValueOfCell(contrAgent);
                const paymentDestinationValue: string | number = getValueOfCell(paymentDestination);
                const initiatorOfPaymentValue: string | number = getValueOfCell(initiatorOfPayment);
                const sumValue: string | number = getValueOfCell(sum);

                const row: ImportTableRow = {
                    number: i,
                    inputDate: inputDateValue,
                    contrAgent: contrAgentValue,
                    paymentDestination: paymentDestinationValue,
                    initiatorOfPayment: initiatorOfPaymentValue,
                    sum: sumValue,
                }

                newTable.push(row);
                setTable(newTable);
            } catch (e) {
            }
        }
    }, [sheet, from, to, inputDate, contrAgent, paymentDestination, initiatorOfPayment, sum]);

    return (
        <div className='w-fit p-2 mx-auto my-0'>
            <table className="sticky top-[-1px]">
                <thead>
                <tr>
                    <th className='border bg-white h-10 font-normal'>
                    </th>
                    <th className='border bg-white h-10 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        <input
                            className='w-full h-full text-center'
                            type='number'
                            value={from}
                            onChange={(e) => setFrom(Number(e.target.value))}
                        />
                    </th>
                    <th className='border bg-white h-10 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        <input
                            className='w-full h-full text-center'
                            type='number'
                            value={to}
                            onChange={(e) => setTo(Number(e.target.value))}
                        />
                    </th>
                    <th className='border bg-white h-10 font-normal' style={{minWidth: 400, maxWidth: 400}}>
                        <input className='w-full h-full text-center' type='file' onChange={handleFileUpload}/>
                    </th>
                    <th className='border bg-white h-10 p-0 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        <button className='w-full h-full text-center hover:bg-gray-200' onClick={submit}>
                            Применить
                        </button>
                    </th>
                    <th className='border bg-white h-10 text-center font-normal' style={{minWidth: 100, maxWidth: 100}}>
                        Total: {total}
                    </th>
                </tr>
                <tr>
                    <th className='border bg-white h-10 font-normal' style={{minWidth: 100, maxWidth: 100}}>
                    </th>
                    <th className='border bg-white h-10 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        <input
                            className='w-full h-full text-center'
                            value={inputDate}
                            onChange={(e) => setInputDate(e.target.value)}
                        />
                    </th>
                    <th className='border bg-white h-10 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        <input
                            className='w-full h-full text-center'
                            value={contrAgent}
                            onChange={(e) => setContrAgent(e.target.value)}
                        />
                    </th>
                    <th className='border bg-white h-10 font-normal' style={{minWidth: 400, maxWidth: 400}}>
                        <input
                            className='w-full h-full text-center'
                            value={paymentDestination}
                            onChange={(e) => setPaymentDestination(e.target.value)}
                        />
                    </th>
                    <th className='border bg-white h-10 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        <input
                            className='w-full h-full text-center'
                            value={initiatorOfPayment}
                            onChange={(e) => setInitiatorOfPayment(e.target.value)}
                        />
                    </th>
                    <th className='border bg-white h-10 font-normal' style={{minWidth: 100, maxWidth: 100}}>
                        <input
                            className='w-full h-full text-center'
                            value={sum}
                            onChange={(e) => setSum(e.target.value)}
                        />
                    </th>
                </tr>
                <tr>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 100, maxWidth: 100}}>
                        Номер
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        Вх.дата
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        Получатель
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 400, maxWidth: 400}}>
                        Назначение платежа
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        Инициатор по договору
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 100, maxWidth: 100}}>
                        Сумма
                    </th>
                </tr>
                </thead>
            </table>
            <table className='mt-[-1px]'>
                <tbody>
                {table.map((row: ImportTableRow, index: number) => {
                    if (index < 5 || index > table.length - 6) {
                        return (
                            <tr key={index}>
                                <td className="border bg-white h-10 p-2" style={{minWidth: 100, maxWidth: 100}}>
                                    {row.number}
                                </td>
                                <td className="border bg-white h-10 p-2" style={{minWidth: 200, maxWidth: 200}}>
                                    {row.inputDate.toLocaleDateString()}
                                </td>
                                <td className="border bg-white h-10 p-2" style={{minWidth: 200, maxWidth: 200}}>
                                    {row.contrAgent}
                                </td>
                                <td className="border bg-white h-10 p-2" style={{minWidth: 400, maxWidth: 400}}>
                                    {row.paymentDestination}
                                </td>
                                <td className="border bg-white h-10 p-2" style={{minWidth: 200, maxWidth: 200}}>
                                    {row.initiatorOfPayment}
                                </td>
                                <td className="border bg-white h-10 p-2" style={{minWidth: 100, maxWidth: 100}}>
                                    {row.sum}
                                </td>
                            </tr>
                        );
                    }
                })}
                </tbody>
            </table>
        </div>
    )
}
