import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL as api } from "../../utils/constants";
import {
	Box,
	Card,
	Button,
	FormControl,
	Text,
	Textarea,
	useToast,
	useColorModeValue,
} from "@chakra-ui/react";
import Spinner from "../General/Spinner";
import Footer from "../General/Footer";

export default function OpenCase() {
	const { petId } = useParams();
	const navigate = useNavigate();

	const [pet, setPet] = useState(null);
	const [petName, setPetName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [reasonForVisit, setReasonForVisit] = useState("");
	const toast = useToast();

	const bg = useColorModeValue("#F3F3F3", "gray.900");
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const titleColor = useColorModeValue("gray.900", "gray.100");
	const textareaBg = useColorModeValue("gray.50", "gray.700");

	useEffect(() => {
		const fetchPetDetails = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/user/getPetInfo/${petId}`, {
					withCredentials: true,
				});
				if (response.status === 200) {
					setPet(response.data.pet);
					setPetName(response.data.pet.name);
				}
			} catch (error) {
				toast({
					title: "خطأ",
					description: "حدث خطأ داخلي في الخادم",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top",
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchPetDetails();
	}, [toast, petId]);

	const handleSubmit = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/case/createCase`,
				{
					petId: petId,
					reasonForVisit: reasonForVisit,
				},
				{
					withCredentials: true,
				}
			);
			if (response.status === 200) {
				toast({
					title: "تم فتح الحالة بنجاح",
					description: "تم إرسال سبب الزيارة للطبيب بنجاح.",
					status: "success",
					duration: 3000,
					isClosable: true,
					position: "top",
				});
				navigate(`/pet-details/${petId}`);
			} else {
				toast({
					title: response.data.message || "فشل في فتح الحالة",
					status: "error",
					duration: 2500,
					position: "top",
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: "خطأ",
				description: "حدث خطأ داخلي في الخادم",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <Spinner message='جارٍ التحميل...' />;
	}

	if (!pet) {
		return (
			<Box
				dir='rtl'
				display='flex'
				justifyContent='center'
				alignItems='center'
				height='87vh'
				bg={bg}
			>
				<Text fontSize='2xl' color='red.500'>
					لم يتم العثور على الحيوان
				</Text>
			</Box>
		);
	}

	return (
		<>
			<Box
				dir='rtl'
				display='flex'
				justifyContent='center'
				alignItems='center'
				minH={"75vh"}
				bg={bg}
			>
				<Card
					bg={cardBg}
					border='1px solid'
					borderColor={borderColor}
					borderRadius={"md"}
					boxShadow='md'
					width={{ base: "95%", md: "60%", lg: "40%" }}
					display='flex'
					flexDirection='column'
					justifyContent='center'
					alignItems='center'
					p={{ base: 4, md: 8 }}
				>
					{/* Header */}
					<Box
						display='flex'
						flexDirection='column'
						justifyContent='center'
						alignItems='center'
						mb={6}
					>
						<Text fontWeight='bold' fontSize='2xl' color={titleColor} mb={2}>
							فتح حالة جديدة
						</Text>
						<Text fontSize='lg' color='gray.600'>
							سيتم إرسال سبب الزيارة للطبيب ليتمكن من قبول الحالة وبدء العمل
							عليها.
						</Text>
					</Box>

					{/* Pet Info */}
					<Box
						display='flex'
						flexDirection='column'
						alignItems='center'
						mb={4}
						width='100%'
					>
						<Text fontSize='md' color='gray.700'>
							فتح حالة للحيوان: <b>{petName}</b>
						</Text>
					</Box>

					{/* Reason For Visit */}
					<FormControl width='100%' mb={6}>
						<Text mb={2} fontWeight='semibold'>
							سبب الزيارة
						</Text>
						<Textarea
							resize='none'
							height='120px'
							borderRadius='md'
							placeholder='اكتب سبب الزيارة هنا...'
							value={reasonForVisit}
							onChange={(e) => setReasonForVisit(e.target.value)}
							p={4}
							fontSize='md'
							bg={textareaBg}
						/>
					</FormControl>

					<Button
						colorScheme='blue'
						width='100%'
						fontWeight='bold'
						fontSize='lg'
						isDisabled={!reasonForVisit.trim()}
						_hover={{
							bg: "#D4F500",
							color: "#000",
							transform: "scale(1.01)",
						}}
						_active={{
							transform: "scale(0.98)",
							opacity: 0.8,
						}}
						onClick={handleSubmit}
					>
						إرسال
					</Button>
				</Card>
			</Box>
		</>
	);
}
