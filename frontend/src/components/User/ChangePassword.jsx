// React Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Button,
	Card,
	FormControl,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	useToast,
} from "@chakra-ui/react";

// React Icons Imports
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { PiPasswordBold } from "react-icons/pi";

// Custom Component Imports
import Spinner from "../General/Spinner";
import Footer from "../General/Footer";

export default function ChangePassword() {
	const navigate = useNavigate();
	const toast = useToast();

	// Form useStates
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// Show Password useStates
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const handleChangePassword = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/changePassword`,
				{
					oldPassword: oldPassword,
					newPassword: newPassword,
					confirmPassword: confirmPassword,
				},
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

				try {
					setIsLoading(true);
					await axios.post(`${api}/user/logout`, {}, { withCredentials: true });
					navigate("/login");
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

	return isLoading ? (
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
					justifyContent={"center"}
					alignItems={"center"}
					width={"80%"}
					height={"80%"}
				>
					{/* Header */}
					<Box
						display={"flex"}
						flexDirection={"column"}
						justifyContent={"center"}
						alignItems={"center"}
						height={"15%"}
						mt={5}
					>
						<Icon as={MdOutlinePassword} fontSize={"40px"} />
						<Text fontSize={"40px"} fontWeight={"bold"}>
							تغيير كلمة المرور
						</Text>
					</Box>

					{/* Body */}
					<Box
						display={"flex"}
						flexDirection={"column"}
						justifyContent={"center"}
						alignItems={"center"}
						height={"70%"}
						width={"90%"}
					>
						<FormControl
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							mb={5}
						>
							<InputGroup>
								{showOldPassword ? (
									<InputRightElement
										children={
											<IconButton
												_hover={{}}
												_active={{}}
												onClick={() => {
													setShowOldPassword(!showOldPassword);
												}}
												as={FaEye}
												cursor={"pointer"}
												bg={"#FFF"}
												size={"xs"}
											/>
										}
									/>
								) : (
									<InputRightElement
										children={
											<IconButton
												_hover={{}}
												_active={{}}
												onClick={() => {
													setShowOldPassword(!showOldPassword);
												}}
												as={FaEyeSlash}
												cursor={"pointer"}
												bg={"#FFF"}
												size={"xs"}
											/>
										}
									/>
								)}
								<Input
									id='oldPassword'
									type={showOldPassword ? "text" : "password"}
									value={oldPassword}
									placeholder='كلمة المرور الحالية'
									onChange={(e) => {
										setOldPassword(e.target.value);
									}}
								/>
							</InputGroup>
						</FormControl>

						<FormControl
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							mb={5}
						>
							<InputGroup>
								{showNewPassword ? (
									<InputRightElement
										children={
											<IconButton
												_hover={{}}
												_active={{}}
												onClick={() => {
													setShowNewPassword(!showNewPassword);
												}}
												as={FaEye}
												cursor={"pointer"}
												bg={"#FFF"}
												size={"xs"}
											/>
										}
									/>
								) : (
									<InputRightElement
										children={
											<IconButton
												_hover={{}}
												_active={{}}
												onClick={() => {
													setShowNewPassword(!showNewPassword);
												}}
												as={FaEyeSlash}
												cursor={"pointer"}
												bg={"#FFF"}
												size={"xs"}
											/>
										}
									/>
								)}
								<Input
									id='newPassword'
									type={showNewPassword ? "text" : "password"}
									value={newPassword}
									placeholder='كلمة المرور الجديدة'
									onChange={(e) => {
										setNewPassword(e.target.value);
									}}
								/>
							</InputGroup>
						</FormControl>

						<FormControl
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
						>
							<InputGroup>
								{showConfirmPassword ? (
									<InputRightElement
										children={
											<IconButton
												_hover={{}}
												_active={{}}
												onClick={() => {
													setShowConfirmPassword(!showConfirmPassword);
												}}
												as={FaEye}
												cursor={"pointer"}
												bg={"#FFF"}
												size={"xs"}
											/>
										}
									/>
								) : (
									<InputRightElement
										children={
											<IconButton
												_hover={{}}
												_active={{}}
												onClick={() => {
													setShowConfirmPassword(!showConfirmPassword);
												}}
												as={FaEyeSlash}
												cursor={"pointer"}
												bg={"#FFF"}
												size={"xs"}
											/>
										}
									/>
								)}
								<Input
									id='confirmPassword'
									type={showConfirmPassword ? "text" : "password"}
									value={confirmPassword}
									placeholder='تأكيد كلمة المرور الجديدة'
									onChange={(e) => {
										setConfirmPassword(e.target.value);
									}}
								/>
							</InputGroup>
						</FormControl>
					</Box>

					{/* Submit Button */}
					<Box
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						height={"15%"}
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
							onClick={handleChangePassword}
							leftIcon={<Icon as={PiPasswordBold} />}
						>
							{" "}
							تغيير كلمة المرور
						</Button>
					</Box>
				</Card>
			</Box>
			<Footer />
		</>
	);
}
