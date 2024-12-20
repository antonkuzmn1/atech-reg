'use client';

import {useEffect, useState} from "react";
import axios from "axios";
import {setAppLoading, setAppMessage} from "@/store/slices/appSlice";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {RootState} from "@/store";
import {formatDate} from "@/utils/formatDate";

export interface MainTableRow {
    id: number;
    dateInput: string,
    dateCopy: string,
    dateOrig: string,
    textDestination: string,
    sum: number,
    sumClosing: number,
    contractorId: number,
    contractor: { id: number, name: string },
    initiatorId: number,
    initiator: { id: number, name: string },
    ddAbout: number,
    ddMark: number,
    ddStatus: number,
    description: number,
};

export default function Home() {
    const dispatch = useDispatch();
    const loggedIn = useSelector((state: RootState) => state.app.loggedIn);

    const [table, setTable] = useState<MainTableRow[]>([]);
    const [editedRows, setEditedRows] = useState<MainTableRow[]>([]);
    const [editedFields, setEditedFields] = useState<{ id: number, field: string }[]>([]);

    const getTable = async (): Promise<void> => {
        return new Promise((resolve, _reject) => {
            axios.get('/api/main', {}).then(res => {
                console.log(res.data);
                setTable(res.data);
            }).catch(err => {
                console.error(err);
                if (typeof err?.response?.data === 'string') {
                    dispatch(setAppMessage(`Error: ${err.response.data}`));
                }
            }).finally(() => {
                resolve();
            });
        })
    }

    const onChangeHandler = (id: number, field: keyof MainTableRow, value: string | number) => {
        const newTable: MainTableRow[] = [...table];
        const index = newTable.findIndex((e) => e.id === id);
        newTable[index][field] = value as never;
        setTable(newTable);

        const newEditedRows: MainTableRow[] = [...editedRows];
        const editedRowIndex = newEditedRows.findIndex((e) => e.id === id);
        if (editedRowIndex === -1) {
            newEditedRows.push(newTable[index]);
        } else {
            newEditedRows[index] = newTable[index];
        }
        setEditedRows(newEditedRows);

        const newEditedFields = [...editedFields];
        const editedFieldsIndex = newEditedFields.findIndex((e) => e.id === id && e.field === field);
        if (editedFieldsIndex === -1) {
            newEditedFields.push({id: id, field: field});
        }
        setEditedFields(newEditedFields);
    }

    const isEdited = (id: number, field: keyof MainTableRow): boolean => {
        const index = editedFields.findIndex((e) => e.id === id && e.field === field);
        return index !== -1;
    }

    const saveTable = () => {
        console.log(editedRows);
        dispatch(setAppLoading(true));
        axios.put('/api/main', {
            rows: editedRows,
        }).then((res) => {
            console.log(res.data);
            if (typeof res?.data?.total === 'number') {
                setEditedRows([]);
                setEditedFields([]);
                getTable().finally(() => {
                    dispatch(setAppLoading(false));
                    dispatch(setAppMessage(`Изменено строк: ${res.data.total}`));
                });
            }
        }).catch((err) => {
            console.error(err);
            if (typeof err?.response?.data === 'string') {
                dispatch(setAppMessage(`Error: ${err.response.data}`));
            }
            dispatch(setAppLoading(false));
        })
    }

    const dropEditedRows = () => {
        dispatch(setAppLoading(true));
        getTable().then(() => {
            dispatch(setAppLoading(false));
            dispatch(setAppMessage('Изменения отменены'));
        });
        setEditedRows([]);
        setEditedFields([]);
    }

    const init = async () => {
        dispatch(setAppLoading(true));
        await getTable();
        dispatch(setAppLoading(false));
    }

    useEffect(() => {
        init().then();
    }, []);

    return (
        <div className="w-fit p-2 mx-auto my-0">
            <table className="sticky top-[-1px]">
                <thead>
                <tr>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 150, maxWidth: 150}}>
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 300, maxWidth: 300}}>
                    </th>
                    <th className='border bg-white h-10 p-0 font-normal' style={{minWidth: 400, maxWidth: 400}}>
                        <button
                            className={'hover:bg-gray-200 w-full h-full p-2'}
                            children={'Экспорт в XLSX'}
                        />
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 300, maxWidth: 300}}>
                    </th>
                    <th className='border bg-white h-10 p-0 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        {editedRows.length > 0 && <button
                            className={'hover:bg-gray-200 w-full h-full p-2'}
                            children={'Сохранить'}
                            onClick={saveTable}
                        />}
                    </th>
                    <th className='border bg-white h-10 p-0 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        {editedRows.length > 0 && <button
                            className={'hover:bg-gray-200 w-full h-full p-2'}
                            children={'Сбросить'}
                            onClick={dropEditedRows}
                        />}
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 150, maxWidth: 150}}>
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 150, maxWidth: 150}}>
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                    </th>
                </tr>
                <tr>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 150, maxWidth: 150}}>
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 300, maxWidth: 300}}>
                        Контрагент
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 400, maxWidth: 400}}>
                        Назначение
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 300, maxWidth: 300}}>
                        Инициатор
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        Сумма
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        Закр. сумма
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        Контроль
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        Информация
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        Отметка
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        Статус
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 150, maxWidth: 150}}>
                        Дата копии
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 150, maxWidth: 150}}>
                        Дата ориг-ла
                    </th>
                    <th className='border bg-white h-10 p-2 font-normal' style={{minWidth: 200, maxWidth: 200}}>
                        Комментарий
                    </th>
                </tr>
                </thead>
            </table>
            <table className='mt-[-1px]'>
                <tbody>
                {table.map((row: MainTableRow, index: number) => {
                    return (
                        <tr key={index}>
                            <td className="border bg-white h-40 p-2" style={{minWidth: 150, maxWidth: 150}}>
                                {formatDate(new Date(row.dateInput))}
                            </td>
                            <td className="border bg-white h-40 p-2" style={{minWidth: 300, maxWidth: 300}}>
                                {row.contractor.name}
                            </td>
                            <td className="border bg-white h-40 p-2" style={{minWidth: 400, maxWidth: 400}}>
                                {row.textDestination}
                            </td>
                            <td className="border bg-white h-40 p-2" style={{minWidth: 300, maxWidth: 300}}>
                                {row.initiator.name}
                            </td>
                            <td className="border bg-white h-40 p-2" style={{minWidth: 200, maxWidth: 200}}>
                                {row.sum}
                            </td>
                            <td className="border bg-white h-40 p-0" style={{minWidth: 200, maxWidth: 200}}>
                                <input
                                    type='number'
                                    className={classNames({
                                        'h-full': true,
                                        'w-full': true,
                                        'p-2': true,
                                        'hover:bg-gray-200': true,
                                        'bg-yellow-200': isEdited(row.id, 'sumClosing'),
                                    })}
                                    min={0}
                                    step={1000}
                                    value={row.sumClosing}
                                    onChange={(e) => onChangeHandler(row.id, 'sumClosing', Number(e.target.value))}
                                />
                            </td>
                            <td className="border bg-white h-40 p-2" style={{minWidth: 200, maxWidth: 200}}>
                                {row.ddMark === 0 && 'В работе'}
                                {row.ddMark === 1 && 'Жду оригинал'}
                                {row.ddMark === 2 && 'Ура! Я молодец!'}
                                {row.ddMark === 3 && 'В работе'}
                            </td>
                            <td className="border bg-white h-40 p-0" style={{minWidth: 200, maxWidth: 200}}>
                                <select
                                    className={classNames({
                                        'h-full': true,
                                        'w-full': true,
                                        'p-2': true,
                                        'hover:bg-gray-200': true,
                                        'bg-yellow-200': isEdited(row.id, 'ddAbout'),
                                    })}
                                    value={row.ddAbout}
                                    onChange={(e) => onChangeHandler(row.id, 'ddAbout', Number(e.target.value))}
                                >
                                    <option value={0}></option>
                                    <option value={1}>Предоставлен закрывающий документ</option>
                                    <option value={2}>Предоставлен авансовый сче-фактура</option>
                                    <option value={3}>Закрытие в следующем периоде</option>
                                    <option value={4}>Предоставлен через ЭДО</option>
                                    <option value={5}>Оплата долга</option>
                                </select>
                            </td>
                            {loggedIn ? <td className="border bg-white h-40 p-0" style={{minWidth: 200, maxWidth: 200}}>
                                <select
                                    className={classNames({
                                        'h-full': true,
                                        'w-full': true,
                                        'p-2': true,
                                        'hover:bg-gray-200': true,
                                        'bg-yellow-200': isEdited(row.id, 'ddMark'),
                                    })}
                                    value={row.ddMark}
                                    onChange={(e) => onChangeHandler(row.id, 'ddMark', Number(e.target.value))}
                                >
                                    <option value={0}></option>
                                    <option value={1}>Предоставлена копия документа</option>
                                    <option value={2}>Предоставлен оригинал документа</option>
                                    <option value={3}>Документ направлен на доработку</option>
                                </select>
                            </td> : <td className="border bg-white h-40 p-2" style={{minWidth: 200, maxWidth: 200}}>
                                {row.ddMark === 0 && ''}
                                {row.ddMark === 1 && 'Предоставлена копия документа'}
                                {row.ddMark === 2 && 'Предоставлен оригинал документа'}
                                {row.ddMark === 3 && 'Документ направлен на доработку'}
                            </td>}
                            <td className="border bg-white h-40 p-0" style={{minWidth: 200, maxWidth: 200}}>
                                <select
                                    className={classNames({
                                        'h-full': true,
                                        'w-full': true,
                                        'p-2': true,
                                        'hover:bg-gray-200': true,
                                        'bg-yellow-200': isEdited(row.id, 'ddStatus'),
                                    })}
                                    value={row.ddStatus}
                                    onChange={(e) => onChangeHandler(row.id, 'ddStatus', Number(e.target.value))}
                                >
                                    <option value={0}></option>
                                    <option value={1}>Копия</option>
                                    <option value={2}>Оригинал</option>
                                </select>
                            </td>
                            <td className="border bg-white h-40 p-0" style={{minWidth: 150, maxWidth: 150}}>
                                <input
                                    type='date'
                                    className={classNames({
                                        'h-full': true,
                                        'w-full': true,
                                        'p-2': true,
                                        'hover:bg-gray-200': true,
                                        'bg-yellow-200': isEdited(row.id, 'dateCopy'),
                                    })}
                                    value={row.dateCopy?.split('T')[0]}
                                    onChange={(e) => onChangeHandler(row.id, 'dateCopy', e.target.value)}
                                />
                            </td>
                            <td className="border bg-white h-40 p-0" style={{minWidth: 150, maxWidth: 150}}>
                                <input
                                    type='date'
                                    className={classNames({
                                        'h-full': true,
                                        'w-full': true,
                                        'p-2': true,
                                        'hover:bg-gray-200': true,
                                        'bg-yellow-200': isEdited(row.id, 'dateOrig'),
                                    })}
                                    value={row.dateOrig?.split('T')[0]}
                                    onChange={(e) => onChangeHandler(row.id, 'dateOrig', e.target.value)}
                                />
                            </td>
                            <td className="border bg-white h-40 p-0" style={{minWidth: 200, maxWidth: 200}}>
                                <textarea
                                    className={classNames({
                                        'mt-[5px]': true,
                                        'h-full': true,
                                        'w-full': true,
                                        'p-2': true,
                                        'resize-none': true,
                                        'hover:bg-gray-200': true,
                                        'bg-yellow-200': isEdited(row.id, 'description'),
                                    })}
                                    value={row.description}
                                    onChange={(e) => onChangeHandler(row.id, 'description', e.target.value)}
                                />
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
