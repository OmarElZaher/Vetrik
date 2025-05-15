// React Imports
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Axios Import
import axios from "axios";

// API URL Import
import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	IconButton,
	Icon,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverFooter,
	PopoverArrow,
	PopoverCloseButton,
	useToast,
	Text,
} from "@chakra-ui/react";

// React Icons Imports
import { IoMdLogOut } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";

// Custom Component Imports
import VetDrawer from "./VetDrawer";
import SecretaryDrawer from "./SecretaryDrawer";
import Spinner from "./Spinner";

export default function Header() {
	const navigate = useNavigate();
	const toast = useToast();

	// Misc useStates
	const [isLoading, setIsLoading] = useState(false);

	const [role] = useState(localStorage.getItem("userRole") || "user");

	const [notificationCount, setNotificationCount] = useState(0);
	const [notifications, setNotifications] = useState([]);

	const handleLogout = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				`${api}/user/logout`,
				{},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				localStorage.clear();
				navigate("/login");
			}
		} catch (error) {
			if (error.response.data.message === "غير مسجل الدخول") {
				navigate("/login");
			} else {
				toast({
					title: error.response.data.message,
					status: "error",
					duration: 2000,
					position: "top",
					isClosable: true,
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await axios.get(`${api}/notification/`, {
					withCredentials: true,
				});

				if (response.status === 200) {
					setNotificationCount(response.data.length);
					setNotifications(response.data);
				}
			} catch (error) {
				if (error.response.status === 500) {
					toast({
						title: error?.response?.data?.message,
						description: "حدث خطأ ما",
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				} else {
					navigate("/login");
				}
			}
		};

		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${api}/user/getUserInfo`, {
					withCredentials: true,
				});

				if (response.status !== 200) {
					toast({
						title: response?.data?.message,
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				}
			} catch (error) {
				if (error.response.status === 500) {
					toast({
						title: error?.response?.data?.message,
						description: "حدث خطأ ما",
						status: "error",
						duration: 2500,
						isClosable: true,
						position: "top",
					});
				} else {
					navigate("/login");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
		fetchNotifications();

		const interval = setInterval(fetchNotifications, 10000);
		return () => clearInterval(interval);
	}, [navigate, toast]);

	return isLoading ? (
		<Spinner />
	) : (
		<Box
			as='nav'
			bg='#121211'
			width='100%'
			height='50px'
			position='sticky'
			top={0}
			color='#FFFFFF'
			zIndex={10}
		>
			<Box display='flex' justifyContent='center' alignItems='center'>
				<Box
					width='33vw'
					height='50px'
					display='flex'
					justifyContent='flex-start'
					alignItems='center'
					key={1}
					fontSize='25px'
				>
					{role === "secretary" ? (
						<SecretaryDrawer />
					) : role === "vet" ? (
						<VetDrawer />
					) : null}
				</Box>
				<Box
					width='33vw'
					height='50px'
					display='flex'
					justifyContent='center'
					alignItems='center'
					key={2}
				>
					<Link
						to={
							role === "admin"
								? "/admin"
								: role === "vet"
								? "/vet"
								: "/secretary"
						}
					>
						Vetrik 🐾
					</Link>
				</Box>
				<Box
					width='33vw'
					height='50px'
					display='flex'
					justifyContent='flex-end'
					alignItems='center'
					key={3}
				>
					{notificationCount > 0 ? (
						<>
							<Popover>
								<PopoverTrigger>
									<IconButton
										icon={<Icon as={FaBell} boxSize={7} />}
										aria-label='Notifications'
										bg='#121211'
										color='#FFF'
										_hover={{
											color: "#D4F500",
										}}
										_active={{
											bg: "#121211",
											transform: "scale(0.95)",
										}}
										boxSize='50px'
										boxShadow='lg'
										transition='all 0.2s ease'
										mr={4}
									/>
								</PopoverTrigger>

								<PopoverContent borderRadius={"10px"}>
									<PopoverArrow />
									<PopoverCloseButton />
									<PopoverHeader
										display={"flex"}
										justifyContent={"center"}
										alignItems={"center"}
										color={"#000"}
									>
										الإشعارات
									</PopoverHeader>

									<PopoverBody
										display={"flex"}
										justifyContent={"center"}
										alignItems={"center"}
										flexDirection={"column"}
										color={"#000"}
										overflowY={"auto"}
										maxHeight={"300px"}
									>
										{notifications.map((notification) => (
											<Box
												key={notification._id}
												p={2}
												borderBottom='1px'
												borderColor='gray.200'
											>
												<Text>{notification.message}</Text>
											</Box>
										))}
									</PopoverBody>

									<PopoverFooter>
										<Text
											color='blue.500'
											cursor='pointer'
											onClick={() => {
												setNotifications([]);
												setNotificationCount(0);
											}}
										>
											مسح جميع الإشعارات
										</Text>
									</PopoverFooter>
								</PopoverContent>
							</Popover>
						</>
					) : (
						<>
							<Popover>
								<PopoverTrigger>
									<IconButton
										icon={<Icon as={FaRegBell} boxSize={7} />}
										aria-label='Notifications'
										bg='#121211'
										color='#FFF'
										_hover={{
											color: "#D4F500",
										}}
										_active={{
											bg: "#121211",
											transform: "scale(0.95)",
										}}
										boxSize='50px'
										boxShadow='lg'
										transition='all 0.2s ease'
										mr={4}
									/>
								</PopoverTrigger>

								<PopoverContent>
									<PopoverArrow />
									<PopoverCloseButton />
									<PopoverHeader
										display={"flex"}
										justifyContent={"center"}
										alignItems={"center"}
										color={"#000"}
									>
										الإشعارات
									</PopoverHeader>

									<PopoverBody
										display={"flex"}
										justifyContent={"center"}
										alignItems={"center"}
										flexDirection={"column"}
										color={"#000"}
										overflowY={"auto"}
										maxHeight={"300px"}
									>
										<Text>لا توجد إشعارات جديدة</Text>
									</PopoverBody>

									<PopoverFooter>
										<Text
											color='blue.500'
											cursor='pointer'
											onClick={() => {
												setNotifications([]);
												setNotificationCount(0);
											}}
										>
											مسح جميع الإشعارات
										</Text>
									</PopoverFooter>
								</PopoverContent>
							</Popover>
						</>
					)}

					<IconButton
						icon={<Icon as={IoMdLogOut} boxSize={7} />}
						aria-label='تسجيل الخروج'
						onClick={handleLogout}
						bg='#121211'
						color='#FFF'
						_hover={{
							color: "#D4F500",
						}}
						_active={{
							bg: "#121211",
							transform: "scale(0.95)",
						}}
						boxSize='50px'
						boxShadow='lg'
						transition='all 0.2s ease'
						mr={4}
					/>
				</Box>
			</Box>
		</Box>
	);
}
