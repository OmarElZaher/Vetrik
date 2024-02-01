/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
	Tooltip,
	useToast,
} from "@chakra-ui/react";

// React Icon Imports
import { BiHealth } from "react-icons/bi";
import { IoMdDownload } from "react-icons/io";
import { MdDelete, MdUpload } from "react-icons/md";

// Custom Component Imports
import Footer from "../General/Footer";
import Spinner from "../General/Spinner";

export default function PetHealthRecords() {
	const { petId } = useParams();
	const toast = useToast();

	// File useStates
	const [selectedFile, setSelectedFile] = useState(null);

	// Health Record useStates
	const [healthRecords, setHealthRecords] = useState([]);

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

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
					title: "Please select a valid file type.",
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
				title: "Please select a file to upload.",
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
			"Are you sure you want to delete this health record?"
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

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						bg={"#F3F3F3"}
						height={"87vh"}
					>
						<Card
							display={"flex"}
							flexDirection={"column"}
							justifyContent={"center"}
							alignItems={"center"}
							width={"90%"}
							height={"90%"}
						>
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"15%"}
							>
								<Icon as={BiHealth} fontSize={"60px"} />
								<Text
									fontSize={"40px"}
									fontWeight={"bold"}
									textDecoration={"underline"}
								>
									Health Records
								</Text>
							</Box>
							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"50%"}
							>
								<TableContainer
									width={"100%"}
									maxHeight={"80%"}
									overflowY={"auto"}
								>
									<Table variant='simple' size='md'>
										<Thead>
											<Tr>
												<Th textAlign={"left"}>File Name</Th>
												<Th textAlign={"center"}>Last Date Modified</Th>
												<Th textAlign={"center"}>Action</Th>
											</Tr>
										</Thead>
										<Tbody>
											{healthRecords.map((row) => (
												<Tr key={row._id}>
													<Td textAlign={"left"}>{row.filename}</Td>
													<Td textAlign={"center"}>
														{new Date(row.updatedAt).toLocaleString("en-UK", {
															weekday: "long",
															year: "2-digit",
															month: "long",
															day: "2-digit",
															hour: "numeric",
															minute: "numeric",
															hour12: true,
														})}
													</Td>
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
																handleDownload(row._id);
															}}
															leftIcon={<IoMdDownload />}
															mr={2.5}
														>
															Download
														</Button>
														<Tooltip
															hasArrow
															label='Deletes Health Record for Pet'
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
																	handleDelete(row._id);
																}}
																variant={"outline"}
																borderColor={"#EF5350"}
																leftIcon={<MdDelete />}
																ml={2.5}
															>
																Delete
															</Button>
														</Tooltip>
													</Td>
												</Tr>
											))}
										</Tbody>
									</Table>
								</TableContainer>
							</Box>
							<Box
								display={"flex"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"center"}
								width={"90%"}
								height={"15%"}
							>
								<Input
									type={"file"}
									onChange={handleFileChange}
									cursor={"pointer"}
									width={"40%"}
									mb={5}
								/>
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
									onClick={handleUpload}
									leftIcon={<MdUpload />}
								>
									Upload
								</Button>
							</Box>
						</Card>
					</Box>
					<Footer />
				</>
			)}
		</>
	);
}
