/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Button,
	Card,
	Icon,
	Input,
	Table,
	TableContainer,
	Tbody,
	Thead,
	Td,
	Th,
	Tr,
	Text,
	useToast,
	useColorModeValue,
} from "@chakra-ui/react";

// React Icon Imports
import { BiHealth } from "react-icons/bi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaFileDownload, FaFileUpload } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdDriveFileMoveRtl } from "react-icons/md";

// Custom Component Imports
import Spinner from "../General/Spinner";

export default function PetHealthRecords() {
	const { petId } = useParams();
	const toast = useToast();
	const navigate = useNavigate();

	// File useStates
	const [selectedFile, setSelectedFile] = useState(null);

	// Health Record useStates
	const [healthRecords, setHealthRecords] = useState([]);

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const bg = useColorModeValue("gray.50", "gray.900");
	const cardBg = useColorModeValue("white", "gray.800");
	const cardBorderColor = useColorModeValue("gray.200", "gray.700");
	const cardTextColor = useColorModeValue("gray.800", "gray.100");

	const sectionBg = useColorModeValue("gray.100", "gray.700");
	const sectionBorderColor = useColorModeValue("gray.200", "gray.600");

	const sectionHeaderBg = useColorModeValue("gray.200", "gray.600");
	const rowHoverBg = useColorModeValue("gray.50", "gray.900");
	const iconColor = useColorModeValue("gray.400", "gray.600");
	const emptyTextColor = useColorModeValue("gray.500", "gray.400");
	const inputBg = useColorModeValue("white", "gray.800");
	const inputTextColor = useColorModeValue("gray.800", "gray.100");
	const inputBorderColor = useColorModeValue("gray.200", "gray.600");

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				`${api}/user/getAllHealthRecords/${petId}`,
				{ withCredentials: true }
			);

			if (response.status === 200) {
				setHealthRecords(response.data.healthRecords);
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
				title: error,
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		const allowedFileTypes = [
			"doc",
			"docx",
			"pdf",
			"pages",
			"txt",
			"jpg",
			"jpeg",
			"png",
		];

		if (file) {
			const fileExtension = file.name.split(".").pop().toLowerCase();

			if (!allowedFileTypes.includes(fileExtension)) {
				toast({
					title: "يرجى اختيار نوع ملف صالح.",
					status: "error",
					duration: 2500,
					isClosable: true,
					position: "top",
				});
				e.target.value = "";
				setSelectedFile(null);
				return;
			} else {
				setSelectedFile(file);
			}
		}
	};

	const handleUpload = async () => {
		if (selectedFile === null) {
			toast({
				title: "يرجى اختيار ملف للرفع.",
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
			return;
		}

		const formData = new FormData();
		formData.append("file", selectedFile);

		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/uploadHealthRecord/${petId}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
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
				fetchData();
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
				title: error,
				status: "error",
				duration: 2500,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDownload = async (healthRecordId) => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				`${api}/user/downloadHealthRecord/${petId}/${healthRecordId}`,
				{
					responseType: "arraybuffer",
				}
			);

			const contentDisposition = response.headers["content-disposition"];
			const filenameMatch =
				contentDisposition && contentDisposition.match(/filename="(.+)"/);
			const filename = filenameMatch ? filenameMatch[1] : "HealthRecord.pdf";

			const blob = new Blob([response.data]);

			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			a.click();
			window.URL.revokeObjectURL(url);
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

	const handleDelete = async (healthRecordId) => {
		const confirmDelete = window.confirm(
			"هل أنت متأكد أنك تريد حذف هذا السجل الصحي؟"
		);

		if (confirmDelete) {
			try {
				setIsLoading(true);
				const response = await axios.delete(
					`${api}/user/deleteHealthRecord/${healthRecordId}`,
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
					fetchData();
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

	useEffect(() => {
		fetchData();
	}, []);

	return isLoading ? (
		<Spinner />
	) : (
		<>
			<Box
				bg={bg}
				py={8}
				px={{ base: 2, md: 0 }}
				display='flex'
				justifyContent='center'
				alignItems='flex-start'
			>
				<Card
					bg={cardBg}
					p={{ base: 4, md: 10 }}
					rounded='2xl'
					shadow='lg'
					maxW='900px'
					w='100%'
					mx='auto'
					border='1px solid'
					borderColor={cardBorderColor}
				>
					{/* Header */}
					<Box textAlign='center' mb={6}>
						<Icon as={BiHealth} boxSize={16} color='blue.500' mb={2} />
						<Text
							as='h1'
							fontWeight='bold'
							fontSize='3xl'
							textDecoration='underline'
							mb={2}
							color={cardTextColor}
						>
							السجلات الصحية
						</Text>
					</Box>

					{/* Health Records Table */}
					<Box
						bg={sectionBg}
						rounded='lg'
						py={3}
						px={{ base: 1, md: 5 }}
						boxShadow='sm'
						mb={8}
						border='1px solid'
						borderColor={sectionBorderColor}
					>
						<TableContainer>
							<Table size='md' variant='unstyled'>
								<Thead>
									<Tr bg={sectionHeaderBg}>
										<Th />
										<Th textAlign='center' color={cardTextColor}>
											اسم الملف
										</Th>
										<Th textAlign='center' color={cardTextColor}>
											آخر تعديل
										</Th>
										<Th textAlign='center' color={cardTextColor}>
											إجراء
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									{healthRecords.length === 0 ? (
										<Tr>
											<Td colSpan={4} textAlign='center' py={10}>
												<Box>
													<Icon
														as={BiHealth}
														boxSize={10}
														color={iconColor}
														mb={2}
													/>
													<Text color={emptyTextColor} fontWeight='bold'>
														لا توجد سجلات صحية بعد
													</Text>
												</Box>
											</Td>
										</Tr>
									) : (
										healthRecords.map((rec) => (
											<Tr key={rec._id} _hover={{ bg: rowHoverBg }}>
												<Td textAlign='center'>
													<Icon
														as={MdDriveFileMoveRtl}
														color='blue.400'
														verticalAlign='middle'
														ml={1}
													/>
												</Td>
												<Td textAlign='center' color={cardTextColor}>
													{rec.filename}
												</Td>
												<Td textAlign='center' color={cardTextColor}>
													{rec.updatedAt
														? new Date(rec.updatedAt).toLocaleString("ar-EG", {
																dateStyle: "full",
																timeStyle: "short",
														  })
														: "—"}
												</Td>
												<Td textAlign='center'>
													<Button
														size='sm'
														variant='ghost'
														colorScheme='blue'
														rightIcon={<FaFileDownload />}
														onClick={() => handleDownload(rec._id)}
														mx={1}
													>
														تحميل
													</Button>
													<Button
														size='sm'
														variant='outline'
														colorScheme='red'
														rightIcon={<MdDelete />}
														onClick={() => handleDelete(rec._id)}
														mx={1}
													>
														حذف
													</Button>
												</Td>
											</Tr>
										))
									)}
								</Tbody>
							</Table>
						</TableContainer>
					</Box>

					{/* Upload Section */}
					<Box
						bg={bg}
						p={4}
						rounded='lg'
						boxShadow='xs'
						display='flex'
						flexDirection={{ base: "column", md: "row" }}
						alignItems='center'
						justifyContent='center'
						gap={3}
						border='1px solid'
						borderColor={cardBorderColor}
					>
						<Input
							type='file'
							onChange={handleFileChange}
							accept='.pdf,.doc,.docx,.pages,.txt,.jpg,.jpeg,.png'
							w={{ base: "100%", md: "auto" }}
							bg={inputBg}
							color={inputTextColor}
							border='1px solid'
							borderColor={inputBorderColor}
						/>
						<Button
							colorScheme='blue'
							rightIcon={<FaFileUpload />}
							onClick={handleUpload}
							mt={{ base: 3, md: 0 }}
							px={6}
							isLoading={isLoading}
						>
							رفع
						</Button>
						<Button
							variant='outline'
							colorScheme='gray'
							rightIcon={<IoMdArrowRoundBack />}
							onClick={() => navigate(-1)}
							mt={{ base: 3, md: 0 }}
							px={6}
						>
							رجوع
						</Button>
					</Box>
				</Card>
			</Box>
		</>
	);
}
