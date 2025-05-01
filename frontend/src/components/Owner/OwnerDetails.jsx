import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import { API_URL as api } from "../../utils/constants";

import {
  Box,
  Button,
  Card,
  CardBody,
  Icon,
  Input,
  Table,
  TableContainer,
  Th,
  Thead,
  Tr,
  Td,
  Tbody,
  Text,
  Tooltip,
  Select,
  useToast,
  Stack
} from "@chakra-ui/react";

import { FaRegEdit } from "react-icons/fa";
import { IoMdEye, IoMdAdd, IoMdArrowRoundBack } from "react-icons/io";
import { TbTrashXFilled } from "react-icons/tb";

import Spinner from "../General/Spinner";

export default function OwnerDetails() {
    
    const { ownerId } = useParams();
    const toast = useToast();
    const navigate = useNavigate();

    const [owner, setOwner] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [gotData, setGotData] = useState(false);
    const [error, setError] = useState(null);

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [breed, setBreed] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState(null);
    const [weight, setWeight] = useState("");

    const handleRemovePet = async (petId) => {

        const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا الحيوان؟");

        if (!confirmDelete) return;

        try {
        setIsLoading(true);
        const response = await axios.delete(`${api}/user/removePetFromOwner/${owner._id}/${petId}`, { withCredentials: true });
        if (response.status === 200) {
            toast({ title: response.data.message, status: "success", duration: 2500, isClosable: true, position: "top" });
            setOwner((prev) => ({ ...prev, pets: prev.pets.filter((pet) => pet._id !== response.data.petId) }));
        }
        } catch (error) {
            toast({ title: error.response.data.message, status: "error", duration: 2500, isClosable: true, position: "top" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteOwner = async () => {

        const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا المالك؟");

        if (!confirmDelete) return;
        try {
            setIsLoading(true);
            const response = await axios.delete(`${api}/user/deleteOwner/${owner._id}`, { withCredentials: true });
        if (response.status === 200) {
            toast({ title: response.data.message, status: "success", duration: 2500, isClosable: true, position: "top" });
            navigate("/search-owner");
        }
        } catch (error) {
            toast({ title: error.response.data.message, status: "error", duration: 2500, isClosable: true, position: "top" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPet = async () => {
        if (!name || !type || !breed || !gender || !weight || !dob) {
            toast({ title: "من فضلك أدخل جميع الحقول", status: "error", duration: 2500, isClosable: true, position: "top" });
        return;
        }
        try {
            setIsLoading(true);
        const response = await axios.post(`${api}/user/createPet`, {
            owners: [owner._id], name, type, breed, gender, weight, dob
        }, { withCredentials: true });
        if (response.status === 200) {
            toast({ title: response.data.message, status: "success", duration: 2500, isClosable: true, position: "top" });
            setOwner((prev) => ({ ...prev, pets: prev.pets.concat(response.data.pet) }));
            setName(""); setType(""); setBreed(""); setGender(""); setWeight(""); setDob(null);
        }
        } catch (error) {
            toast({ title: error.response.data.message, status: "error", duration: 2500, isClosable: true, position: "top" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${api}/user/getOwnerInfo/${ownerId}`, { withCredentials: true });
            if (response.status === 200) {
                setOwner(response.data);
                setGotData(true);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
        };
        fetchData();
    }, [ownerId]);

    if (isLoading) return <Spinner />;
    if (error) return <Text color="red.500">{error}</Text>;
    if (!gotData) return null;

    return (
        <Box
            dir="rtl"
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            alignItems="flex-start"
            justifyContent="center"
            px={{ base: 2, md: 4 }}
            pt={6}
            width="100%"
            >
            <Card width={{ base: "100%", md: "60%" }} mb={{ base: 4, md: 0 }} mr={{ md: 4 }}>
                <CardBody>
                <Box display="flex" flexDirection={{ base: "column", md: "row" }} justifyContent="space-between" mb={4}>
                    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" textDecoration="underline" textAlign="center">
                        {owner.fullName}
                    </Text>
                    <Text
                        cursor="pointer"
                        onClick={() => navigate(`/edit-owner/${owner._id}`)}
                        _hover={{ color: "yellowgreen", textDecoration: "underline" }}
                        _active={{ transform: "scale(0.99)", opacity: 0.5 }}
                        display="flex"
                        alignItems="center"
                        fontSize="lg"
                    >
                    <Icon as={FaRegEdit} ml={1} /> تعديل الملف الشخصي
                    </Text>
                </Box>

                <Stack spacing={4} mb={4}>
                    <Box>
                        <Text fontWeight="bold">البريد الإلكتروني</Text>
                        <Text>{owner.email}</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold">رقم الموبايل</Text>
                        <Text>{owner.mobileNumber}</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold">طريقة التواصل</Text>
                        <Text>{owner.preferredContactMethod}</Text>
                    </Box>
                </Stack>

                <Box>
                    <Text fontWeight="bold" fontSize="xl" mb={2}>الحيوانات المسجلة</Text>
                    <TableContainer overflowX="auto">
                        <Table size="sm" variant="simple" minWidth="600px">
                            <Thead>
                            <Tr>
                                <Th>الاسم</Th>
                                <Th>النوع</Th>
                                <Th>السلالة</Th>
                                <Th>الجنس</Th>
                                <Th>الإجراءات</Th>
                            </Tr>
                            </Thead>
                            <Tbody>
                                {owner.pets.map((pet) => (
                                    <Tr key={pet._id}>
                                    <Td>{pet.name}</Td>
                                    <Td>{pet.type}</Td>
                                    <Td>{pet.breed}</Td>
                                    <Td>{pet.gender}</Td>
                                    <Td>
                                        <Button size="sm" onClick={() => navigate(`/pet-details/${pet._id}`)} rightIcon={<IoMdEye />} mr={2}>عرض</Button>
                                        <Tooltip label="حذف الحيوان" hasArrow>
                                        <Button size="sm" variant="outline" borderColor="#EF5350" onClick={() => handleRemovePet(pet._id)} rightIcon={<TbTrashXFilled />}>حذف</Button>
                                        </Tooltip>
                                    </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box mt={6} display="flex" flexDirection={{ base: "column", md: "row" }} gap={4} justifyContent="center">
                    <Button onClick={() => navigate("/search-owner")} rightIcon={<IoMdArrowRoundBack />}>الرجوع</Button>
                    <Tooltip label="حذف المالك" hasArrow>
                        <Button variant="outline" borderColor="#EF5350" colorScheme="red" rightIcon={<TbTrashXFilled />} onClick={handleDeleteOwner}>حذف</Button>
                    </Tooltip>
                </Box>
                </CardBody>
            </Card>

            <Card width={{ base: "100%", md: "35%" }}>
                <CardBody>
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>إضافة حيوان أليف</Text>
                    <Stack spacing={4}>
                        <Input placeholder="اسم الحيوان" value={name} onChange={(e) => setName(e.target.value)} />
                        <Select placeholder="نوع الحيوان" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="Dog">كلب</option>
                            <option value="Cat">قطة</option>
                            <option value="Bird">طائر</option>
                            <option value="Turtle">سلحفاة</option>
                            <option value="Monkey">قرد</option>
                            <option value="Hamster">هامستر</option>
                            <option value="Fish">سمكة</option>
                        </Select>
                            <Input placeholder="سلالة الحيوان" value={breed} onChange={(e) => setBreed(e.target.value)} />
                            <Select placeholder="اختيار الجنس" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="Male">ذكر</option>
                            <option value="Female">أنثى</option>
                        </Select>
                        <Input placeholder="وزن الحيوان (كجم)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                        <Button onClick={handleAddPet} rightIcon={<IoMdAdd />}>إضافة</Button>
                    </Stack>
                </CardBody>
            </Card>
        </Box>
    );
}

