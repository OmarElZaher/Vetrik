// React Imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Hook Import
import useIsMobile from "../../hooks/useIsMobile";


// Chakra-UI Imports
import {
	Box,
	Button,
	Card,
	CardBody,
	FormControl,
	Icon,
	Input,
	Table,
	TableContainer,
	Thead,
	Tbody,
	Th,
	Td,
	Tr,
	Text,
	Tooltip,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import {
	IoMdPaw,
	IoMdPricetags,
	IoMdMale,
	IoMdCalendar,
	IoMdTime,
	IoMdEye,
	IoMdArrowRoundBack,
	IoMdMedical,
	IoMdDocument,
	IoMdAdd,
	IoMdRefresh,
	IoMdSearch,
} from "react-icons/io";
  
import { TbTrashXFilled } from "react-icons/tb";  
import { BiHealth } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { RiHealthBookFill } from "react-icons/ri";

// Custom Component Imports
import Spinner from "../General/Spinner";
import Footer from "../General/Footer";

function titleCase(str) {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

function formatDate(date) {
	const d = new Date(date);
	let month = "" + (d.getMonth() + 1);
	let day = "" + d.getDate();
	let year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	return [day, month, year].join("-");
}

export default function PetDetails() {
    const { petId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const isMobile = useIsMobile();

	// Pet useStates
	const [pet, setPet] = useState({});
	const [petAge, setPetAge] = useState("");

	// Owner useStates
	const [owner, setOwner] = useState(null);
	const [ownerMobileNumber, setownerMobileNumber] = useState(null);

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);
	const [gotData, setGotData] = useState(false);
	const [error, setIsError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/user/getPetInfo/${petId}`, {
					withCredentials: true,
				});
				if (response.status === 200) {
					setPetAge(response.data.petAge);
					setPet(response.data.pet);
					setGotData(true);
				} else {
					setIsError(response.data.message);
					toast({
						title: response.data.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				setIsError(error.response.data.message);
				toast({
					title: error.response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [petId, toast]);

	const handleRemovePetFromOwner = async (ownerId, petId) => {
		const confirmDelete = window.confirm(
			"هل أنت متأكد أنك تريد إزالة هذا المالك من هذا الحيوان؟"
		);
		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`${api}/user/removePetFromOwner/${ownerId}/${petId}`,
					{ withCredentials: true }
				);

				if (response.status === 200) {
					toast({
						title: response.data.message,
						status: "success",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
					setPet((prev) => ({
						...prev,
						owners: prev.owners.filter(
							(owner) => owner._id !== response.data.ownerId
						),
					}));
				} else {
					toast({
						title: response.data.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				toast({
					title: error.response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleDeletePet = async (petId) => {
		const confirmDelete = window.confirm(
			"هل أنت متأكد أنك تريد حذف هذا الحيوان؟"
		);
		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(`${api}/user/deletePet/${petId}`, {
					withCredentials: true,
				});

				if (response.status === 200) {
					toast({
						title: response.data.message,
						status: "success",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
					navigate("/search-pet");
				} else {
					toast({
						title: response.data.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				toast({
					title: error.response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleAddOwnerToPet = async (ownerId, petId) => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/addPetToOwner/${ownerId}/${petId}`,
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				toast({
					title: response.data.message,
					status: "success",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				setPet((prev) => ({
					...prev,
					owners: prev.owners.concat(response.data.owner),
				}));
				setOwner(null);
				setownerMobileNumber(null);
			} else {
				toast({
					title: response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			}
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearchOwner = async () => {
		if (ownerMobileNumber === null || ownerMobileNumber === "") {
			toast({
				title: "من فضلك أدخل رقم المحمول الخاص بالمالك",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		}
		// else if (!isValidEmail(ownerMobileNumber)) {
		//  toast({
		//      title: "Please Enter a Valid Email Address",
		//      status: "error",
		//      duration: 2500,
		//      isClosable: true,
		//      position: "top",
		//  });
		// }
		else {
			try {
				setIsLoading(true);
				const response = await axios.post(
					`${api}/user/getOwner`,
					{ mobileNumber: ownerMobileNumber },
					{ withCredentials: true }
				);

				if (response.status === 200) {
					setOwner(response.data);
				} else {
					toast({
						title: response.data.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				toast({
					title: error.response.data.message,
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

    if (isMobile) {
        return isLoading ? (
            <Spinner />
        ) : error ? (
            <>
            <Box dir="rtl" display="flex" flexDirection="column" justifyContent="center" alignItems="center" bg="#F3F3F3" minHeight="87vh">
                    <Text fontWeight="bold" fontSize="4xl" color="red">خطأ</Text>
                    <Text fontSize="2xl" textDecoration="underline">{error}</Text>
                    <Button mt={10} width={{ base: "80%", md: "25%" }} onClick={() => navigate("/search-pet")}>الرجوع للبحث</Button>
                </Box>
                <Footer />
            </>
        ) : gotData ? (
            <>
            <Box dir="rtl" display="flex" flexDirection={{ base: "column", md: "row" }} justifyContent="center" alignItems="flex-start" bg="#F3F3F3" px={{ base: 2, md: 4 }} py={6}>
                        {/* Main Pet Card */}
                        <Card width={{ base: "100%", md: "70%" }} mb={{ base: 4, md: 0 }}>
                            <CardBody>
                                <Text fontSize={"35px"} fontWeight="bold" textAlign="center" mb={4}>{titleCase(pet.name)}</Text>

                                <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={4}>
                                    {[
                                        { label: "نوع الحيوان", value: titleCase(pet.type), icon: <IoMdPaw /> },
                                        { label: "السلالة", value: titleCase(pet.breed), icon: <IoMdPricetags /> },
                                        { label: "الجنس", value: titleCase(pet.gender), icon: <IoMdMale /> },
                                        { label: "تاريخ الميلاد", value: formatDate(pet.dob), icon: <IoMdCalendar /> },
                                        { label: "العُمر", value: petAge, icon: <IoMdTime /> }
                                    ].map((item, i) => (
                                        <Box key={i} width={{ base: "100%", md: "48%", lg: "30%" }} mb={3} display="flex" alignItems="center">
                                            <Icon as={item.icon.type} boxSize={5} ml={2} />
                                            <Box>
                                                <Text fontWeight="bold">{item.label}</Text>
                                                <Text>{item.value}</Text>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                <Text fontSize="xl" fontWeight="bold" mb={2}>المالكين</Text>
                                <TableContainer overflowX="auto">
                                    <Table size="sm" minWidth="600px">
                                        <Thead>
                                            <Tr>
                                                <Th>الاسم الكامل</Th>
                                                <Th>البريد الإلكتروني</Th>
                                                <Th>رقم المحمول</Th>
                                                <Th>الإجراءات</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {pet.owners.map(owner => (
                                                <Tr key={owner._id}>
                                                    <Td>{owner.fullName}</Td>
                                                    <Td>{owner.email}</Td>
                                                    <Td>{owner.mobileNumber}</Td>
                                                    <Td>
                                                        <Button size="sm" onClick={() => navigate(`/owner-details/${owner._id}`)} rightIcon={<IoMdEye />} mr={2}>عرض</Button>
                                                        <Tooltip label="إزالة المالك" hasArrow>
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline" 
                                                                colorScheme="red" 
                                                                onClick={() => handleRemovePetFromOwner(owner._id, pet._id)} 
                                                                rightIcon={<TbTrashXFilled />}
                                                            >
                                                                حذف
                                                            </Button>
                                                        </Tooltip>
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>

                                <Box mt={6} display="flex" flexDirection={{ base: "column", md: "row" }} gap={4} justifyContent="center">
                                    <Button onClick={() => navigate(localStorage.getItem("petFilterData") ? "/pet-table" : "/search-pet")} rightIcon={<IoMdArrowRoundBack />}>رجوع</Button>
                                    <Button onClick={() => navigate(`/pet-vaccination/${pet._id}`)} rightIcon={<RiHealthBookFill />}>كارت التطعيمات</Button>
                                    <Button onClick={() => navigate(`/pet-records/${pet._id}`)} rightIcon={<BiHealth />}>السجلات الصحية</Button>
                                    <Tooltip label="حذف الحيوان" hasArrow>
                                        <Button variant="outline" colorScheme="red" onClick={() => handleDeletePet(pet._id)} rightIcon={<TbTrashXFilled />}>حذف</Button>
                                    </Tooltip>
                                </Box>
                            </CardBody>
                        </Card>

                        {/* Side Card: Add Owner */}
                        <Card width={{ base: "100%", md: "30%" }}>
                            <CardBody>
                                <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>إضافة مالك موجود</Text>
                                <Text fontSize="md" textAlign="center" mb={4}>أدخل رقم المحمول للمالك ثم اضغط زر البحث.</Text>

                                {owner !== null ? (
                                    <Box>
                                        <Text fontWeight="bold">الاسم</Text>
                                        <Text>{owner[0].fullName}</Text>
                                        <Text fontWeight="bold" mt={2}>رقم المحمول</Text>
                                        <Text>{owner[0].mobileNumber}</Text>
                                        <Text fontWeight="bold" mt={2}>البريد الإلكتروني</Text>
                                        <Text>{owner[0].email}</Text>

                                        <Box mt={4} display="flex" flexDirection={{ base: "column", md: "row" }} gap={3}>
                                            <Button onClick={() => handleAddOwnerToPet(owner[0]._id, pet._id)} rightIcon={<IoMdAdd />}>إضافة</Button>
                                            <Button onClick={() => { setOwner(null); setownerMobileNumber(null); } } rightIcon={<IoMdRefresh />}>بحث مرة أخرى</Button>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box>
                                        <FormControl mb={4}>
                                            <Input 
                                                type="text" 
                                                placeholder="رقم المحمول" 
                                                value={ownerMobileNumber} 
                                                onChange={(e) => setownerMobileNumber(e.target.value)} 
                                            />
                                        </FormControl>
                                        <Button onClick={handleSearchOwner} width="100%" rightIcon={<IoMdSearch />} >
                                            بحث
                                        </Button>
                                    </Box>
                                )}
                            </CardBody>
                        </Card>
                    </Box>
                    <Footer />
            </>
        ) : null;
    }

    return isLoading ? (
        <Spinner />
    ) : error ? (
        <>
            <Box
                dir='rtl'
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                bg={"#F3F3F3"}
                height={"87vh"}
            >
                <Text fontWeight={"bold"} fontSize={"60px"} color={"red"}>
                    خطأ
                </Text>
                <Text fontSize={"40px"} textDecoration={"underline"}>
                    {error}
                </Text>
                <Button
                    _hover={{
                        bg: "yellowgreen",
                        color: "#000",
                        transform: "scale(1.01)",
                    }}
                    _active={{
                        transform: "scale(0.99)",
                        opacity: "0.5",
                    }}
                    onClick={() => {
                        navigate("/search-pet");
                    }}
                    leftIcon={<IoMdArrowRoundBack />}
                    bg={"#FFF"}
                    width={"25vw"}
                    mt={10}
                >
                    الرجوع للبحث
                </Button>
            </Box>
            <Footer />
        </>
    ) : gotData ? (
        <>
            <>
                <Box
                    dir='rtl'
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    bg={"#F3F3F3"}
                    width={"100vw"}
                    height={"87vh"}
                >
                    {/* Pet Information */}
                    <Card width='70%' height='90%' ml={1.5}>
                        <Box
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            height={"15%"}
                        >
                            <Box width={"33%"} />
                            <Box
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                width={"33%"}
                                height={"100%"}
                            >
                                <Text
                                    fontSize={"30px"}
                                    fontWeight={"bold"}
                                    textDecoration={"underline"}
                                >
                                    {titleCase(pet.name)}
                                </Text>
                            </Box>
                            <Box
                                display={"flex"}
                                justifyContent={"flex-end"}
                                alignItems={"center"}
                                width={"33%"}
                                height={"90%"}
                                ml={5}
                            >
                                <Text
                                    onClick={() => {
                                        navigate(`/edit-pet/${pet._id}`);
                                    }}
                                    _hover={{
                                        color: "yellowgreen",
                                        textDecoration: "underline",
                                    }}
                                    _active={{
                                        transform: "scale(0.99)",
                                        opacity: "0.5",
                                    }}
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    cursor={"pointer"}
                                    fontSize={"20x"}
                                >
                                    <Icon as={FaRegEdit} ml={1.5} />
                                    تعديل البروفايل
                                </Text>
                            </Box>
                        </Box>

                        <hr />

                        <Box
                            display={"flex"}
                            justifyContent={"space-evenly"}
                            height={"15%"}
                            mt={5}
                            mb={2}
                        >
                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                width={"20%"}
                                m={2}
                                p={2}
                            >
                                <Text fontSize={"24px"} fontWeight={"bold"}>
                                    نوع الحيوان
                                </Text>
                                <Text fontSize={"20px"}>{titleCase(pet.type)}</Text>
                            </Box>

                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                width={"20%"}
                                m={2}
                            >
                                <Text fontSize={"24px"} fontWeight={"bold"}>
                                    السلالة
                                </Text>
                                <Text fontSize={"20px"}>{titleCase(pet.breed)}</Text>
                            </Box>

                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                width={"20%"}
                                m={2}
                            >
                                <Text fontSize={"24px"} fontWeight={"bold"}>
                                    الجنس
                                </Text>
                                <Text fontSize={"20px"}>{titleCase(pet.gender)}</Text>
                            </Box>

                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                width={"20%"}
                                m={2}
                            >
                                <Text fontSize={"24px"} fontWeight={"bold"}>
                                    تاريخ الميلاد
                                </Text>
                                <Text fontSize={"20px"}>{formatDate(pet.dob)}</Text>
                            </Box>

                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                width={"20%"}
                                m={2}
                            >
                                <Text fontSize={"24px"} fontWeight={"bold"}>
                                    العُمر
                                </Text>
                                <Text fontSize={"20px"}>{petAge}</Text>
                            </Box>
                        </Box>
                        <hr />

                        {/* Pets Table */}
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            height={"50%"}
                        >
                            <Text fontSize={"24px"} fontWeight={"bold"}>
                                المالكين
                            </Text>
                            <TableContainer
                                width={"92%"}
                                maxHeight={"30vh"}
                                overflowY={"auto"}
                            >
                                <Table variant='simple' size='md'>
                                    <Thead>
                                        <Th textAlign={"left"}>الاسم الكامل</Th>
                                        <Th textAlign={"center"}>البريد الإلكتروني</Th>
                                        <Th textAlign={"center"}>رقم المحمول</Th>
                                        <Th textAlign={"center"}>الإجراءات</Th>
                                    </Thead>
                                    <Tbody>
                                        {pet.owners.map((owner) => (
                                            <Tr key={owner._id}>
                                                <Td textAlign={"left"}>
                                                    {owner.fullName}
                                                </Td>
                                                <Td textAlign={"center"}>{owner.email}</Td>
                                                <Td textAlign={"center"}>{owner.mobileNumber}</Td>
                                                <Td textAlign={"center"}>
                                                    <Button
                                                        _hover={{
                                                            bg: "yellowgreen",
                                                            color: "#000",
                                                            transform: "scale(1.01)",
                                                        }}
                                                        _active={{
                                                            transform: "scale(0.99)",
                                                            opacity: "0.5",
                                                        }}
                                                        onClick={() => {
                                                            navigate(`/owner-details/${owner._id}`);
                                                        }}
                                                        rightIcon={<IoMdEye />}
                                                        ml={2.5}
                                                    >
                                                        عرض
                                                    </Button>
                                                    <Tooltip
                                                        hasArrow
                                                        label='إزالة المالك من ملف الحيوان'
                                                        bg={"#EF5350"}
                                                        placement='top'
                                                        openDelay={75}
                                                    >
                                                        <Button
                                                            _hover={{
                                                                bg: "#EF5350",
                                                                color: "#000",
                                                                transform: "scale(1.01)",
                                                            }}
                                                            _active={{
                                                                transform: "scale(0.99)",
                                                                opacity: "0.5",
                                                            }}
                                                            onClick={() => {
                                                                handleRemovePetFromOwner(owner._id, pet._id);
                                                            }}
                                                            variant={"outline"}
                                                            borderColor={"#EF5350"}
                                                            rightIcon={<MdDelete />}
                                                            ml={2.5}
                                                        >
                                                            حظف
                                                        </Button>
                                                    </Tooltip>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Back Button */}
                        <Box
                            dir='rtl'
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            height={"10%"}
                        >
                            <Button
                                onClick={() => {
                                    if (localStorage.getItem("petFilterData")) {
                                        navigate("/pet-table");
                                    } else {
                                        navigate("/search-pet");
                                    }
                                }}
                                _hover={{
                                    bg: "yellowgreen",
                                    color: "#000",
                                    transform: "scale(1.01)",
                                }}
                                _active={{
                                    transform: "scale(0.99)",
                                    opacity: "0.5",
                                }}
                                rightIcon={<IoMdArrowRoundBack />}
                                width={"15%"}
                                ml={2.5}
                            >
                                رجوع
                            </Button>

                            <Button
                                _hover={{
                                    bg: "yellowgreen",
                                    color: "#000",
                                    transform: "scale(1.01)",
                                }}
                                _active={{
                                    transform: "scale(0.99)",
                                    opacity: "0.5",
                                }}
                                onClick={() => {
                                    navigate(`/pet-vaccination/${pet._id}`);
                                }}
                                rightIcon={<RiHealthBookFill />}
                                width={"30%"}
                                mx={2.5}
                            >
                                كارت التطعيمات
                            </Button>

                            <Button
                                _hover={{
                                    bg: "yellowgreen",
                                    color: "#000",
                                    transform: "scale(1.01)",
                                }}
                                _active={{
                                    transform: "scale(0.99)",
                                    opacity: "0.5",
                                }}
                                onClick={() => {
                                    navigate(`/pet-records/${pet._id}`);
                                }}
                                rightIcon={<BiHealth />}
                                width={"30%"}
                                mx={2.5}
                            >
                                السجلات الصحية
                            </Button>

                            <Tooltip
                                hasArrow
                                label='حذف الحيوان من النظام'
                                bg={"#EF5350"}
                                placement='top'
                                openDelay={75}
                            >
                                <Button
                                    _hover={{
                                        bg: "#EF5350",
                                        color: "#000",
                                        transform: "scale(1.01)",
                                    }}
                                    _active={{
                                        transform: "scale(0.99)",
                                        opacity: "0.5",
                                    }}
                                    onClick={() => {
                                        handleDeletePet(pet._id);
                                    }}
                                    variant={"outline"}
                                    rightIcon={<MdDelete />}
                                    borderColor={"#EF5350"}
                                    width={"15%"}
                                    mr={2.5}
                                >
                                    حذف
                                </Button>
                            </Tooltip>
                        </Box>
                    </Card>
                    <Card width={"25vw"} height={"90%"} mr={1.5}>
                        <CardBody
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"center"}
                        >
                            <Box
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                height={"15%"}
                            >
                                <Text
                                    fontSize={"30px"}
                                    fontWeight={"bold"}
                                    textDecor={"underline"}
                                >
                                    إضافة مالك موجود
                                </Text>
                            </Box>

                            <Box
                                dir='rtl'
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                height={"15%"}
                            >
                                <Text fontSize={"20px"} textAlign={"center"}>
                                    لإضافة مالك موجود لهذا الحيوان، فلتر بالإيميل بتاع المالك
                                    واضغط زر الإضافة.
                                </Text>
                            </Box>

                            {owner !== null ? (
                                <>
                                    <Box
                                        dir='rtl'
                                        display={"flex"}
                                        flexDirection={"column"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        height={"60%"}
                                        p={2}
                                        mb={2}
                                    >
                                        <Text fontSize={"20px"} fontWeight={"bold"}>
                                            اسم المالك
                                        </Text>
                                        <Text fontSize={"18px"}>
                                            {owner[0].fullName}
                                        </Text>
                                        <Text fontSize={"20px"} fontWeight={"bold"} mt={2}>
                                            رقم المحمول
                                        </Text>
                                        <Text fontSize={"18px"}>{owner[0].mobileNumber}</Text>

                                        <Text fontSize={"20px"} fontWeight={"bold"} mt={2}>
                                            البريد الإلكتروني
                                        </Text>
                                        <Text fontSize={"18px"}>{owner[0].email}</Text>
                                    </Box>
                                    <Box
                                        display={"flex"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        height={"10%"}
                                    >
                                        <Button
                                            _hover={{
                                                bg: "yellowgreen",
                                                color: "#000",
                                                transform: "scale(1.01)",
                                            }}
                                            _active={{
                                                transform: "scale(0.99)",
                                                opacity: "0.5",
                                            }}
                                            onClick={() => {
                                                handleAddOwnerToPet(owner[0]._id, pet._id);
                                            }}
                                            rightIcon={<IoMdAdd />}
                                            ml={2.5}
                                        >
                                            إضافة
                                        </Button>

                                        <Button
                                            _hover={{
                                                bg: "yellowgreen",
                                                color: "#000",
                                                transform: "scale(1.01)",
                                            }}
                                            _active={{
                                                transform: "scale(0.99)",
                                                opacity: "0.5",
                                            }}
                                            onClick={() => {
                                                setOwner(null);
                                                setownerMobileNumber(null);
                                            }}
                                            rightIcon={<IoMdSearch />}
                                            mr={2.5}
                                        >
                                            بحث مرة أخرى
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                // No owner
                                <>
                                    <Box
                                        display={"flex"}
                                        flexDirection={"column"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        height={"60%"}
                                        p={2}
                                        mb={2}
                                    >
                                        <FormControl id='email'>
                                            <Input
                                                id='email'
                                                type='email'
                                                name='email'
                                                placeholder='رقم المحمول'
                                                value={ownerMobileNumber}
                                                onChange={(event) => {
                                                    setownerMobileNumber(event.target.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Box>
                                    <Box
                                        dir='rtl'
                                        display={"flex"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        height={"10%"}
                                    >
                                        <Button
                                            _hover={{
                                                bg: "yellowgreen",
                                                color: "#000",
                                                transform: "scale(1.01)",
                                            }}
                                            _active={{
                                                transform: "scale(0.99)",
                                                opacity: "0.5",
                                            }}
                                            onClick={handleSearchOwner}
                                            rightIcon={<IoMdSearch />}
                                        >
                                            بحث
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </CardBody>
                    </Card>
                </Box>
                <Footer />
            </>
        </>
    ) : (
        <></>
    );
}
