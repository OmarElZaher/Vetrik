// React Imports
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL as api } from "../../utils/constants";

// Chakra UI Imports
import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Icon,
	IconButton,
	useDisclosure,
} from "@chakra-ui/react";

import { HamburgerIcon } from "@chakra-ui/icons";

// Ant Design Imports
import { Flex } from "antd";

// React Icons Imports
import { CiEdit } from "react-icons/ci";
import { FaPerson, FaBuffer, FaBookMedical } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { IoMdSearch, IoIosArrowDropdown } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { MdOutlinePets, MdOutlinePassword } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { BsFileMedical } from "react-icons/bs";

// Custom Component Imports
import NavigationLinkDrawer from "./NavigationLinkDrawer";
import axios from "axios";

export default function VetDrawer() {
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = useRef();

	// Hovered useStates
	const [isCloseHovered, setIsCloseHovered] = useState(false);
	const [isSearchHovered, setIsSearchHovered] = useState(false);
	const [isAddHovered, setIsAddHovered] = useState(false);
	const [isEditHovered, setIsEditHovered] = useState(false);
	const [isHomeHovered, setIsHomeHovered] = useState(false);
	const [isChangePasswordHovered, setIsChangePasswordHovered] = useState(false);
	const [isFeedbackHovered, setIsFeedbackHovered] = useState(false);
	const [isCasesHovered, setIsCasesHovered] = useState(false);

	// Open useStates
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isCasesOpen, setIsCasesOpen] = useState(false);

	const [role, setRole] = useState("");

	useEffect(() => {
		const fetchUserRole = async () => {
			try {
				const response = await axios.get(`${api}/user/getUserInfo`, {
					withCredentials: true,
				});

				if (response.status === 200) {
					setRole(response.data.role);
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};
		fetchUserRole();
	});

	const handleHover = (type) => {
		if (type === "close") {
			setIsCloseHovered(true);
		} else if (type === "search") {
			setIsSearchHovered(true);
		} else if (type === "add") {
			setIsAddHovered(true);
		} else if (type === "edit") {
			setIsEditHovered(true);
		} else if (type === "home") {
			setIsHomeHovered(true);
		} else if (type === "changePassword") {
			setIsChangePasswordHovered(true);
		} else if (type === "feedback") {
			setIsFeedbackHovered(true);
		} else if (type === "cases") {
			setIsCasesHovered(true);
		}
	};

	const handleMouseOut = (type) => {
		if (type === "close") {
			setIsCloseHovered(false);
		} else if (type === "search") {
			setIsSearchHovered(false);
		} else if (type === "add") {
			setIsAddHovered(false);
		} else if (type === "edit") {
			setIsEditHovered(false);
		} else if (type === "home") {
			setIsHomeHovered(false);
		} else if (type === "changePassword") {
			setIsChangePasswordHovered(false);
		} else if (type === "feedback") {
			setIsFeedbackHovered(false);
		} else if (type === "cases") {
			setIsCasesHovered(false);
		}
	};

	return (
		<>
			<IconButton
				_hover={{ color: "#D4F500" }}
				onClick={onOpen}
				icon={<HamburgerIcon />}
				ref={btnRef}
				variant='transparent'
				size='xxl'
				width='50px'
				height='50px'
			/>

			<Drawer
				isOpen={isOpen}
				placement='left'
				onClose={onClose}
				finalFocusRef={btnRef}
			>
				<DrawerOverlay />
				<DrawerContent bg='#121211'>
					<DrawerCloseButton
						_hover={{
							color: "#D4F500",
							transform: isCloseHovered ? "rotate(90deg)" : "rotate(0deg)",
							transition: "transform 0.3s ease",
						}}
						onMouseOver={() => {
							handleHover("close");
						}}
						onMouseOut={() => {
							handleMouseOut("close");
						}}
						color='#8F8F8F'
					/>

					<DrawerHeader
						color='#8F8F8F'
						fontSize='20px'
						textDecoration='underline'
						pl='20px'
					>
						القائمة
					</DrawerHeader>

					<DrawerBody>
						<Flex gap='middle' vertical>
							{/* Home Button */}
							<Box>
								<Box
									dir='rtl'
									display={"flex"}
									justifyContent={"flex-start"}
									alignItems={"center"}
								>
									<Button
										_hover={{
											bg: "#D4F500",
											borderColor: "#D4F500",
											color: "#000",
											transform: "scale(1.05)",
										}}
										onMouseOver={() => {
											handleHover("home");
										}}
										onMouseOut={() => {
											handleMouseOut("home");
										}}
										_active={{
											transform: "scale(0.98)",
											opacity: "0.5",
										}}
										onClick={() => {
											navigate("/vet");
										}}
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										fontSize='18px'
										width='100%'
										leftIcon={
											<Icon
												as={GoHome}
												color={isHomeHovered ? "#000" : "#8F8F8F"}
											/>
										}
									>
										الصفحة الرئيسية
									</Button>
								</Box>
							</Box>

							{/* Search Accordion */}
							<Box>
								{/* Search Button */}
								<Box
									dir='rtl'
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
									<Button
										_hover={{
											bg: "#D4F500",
											borderColor: "#D4F500",
											color: "#000",
											transform: "scale(1.05)",
										}}
										_active={{
											transform: "scale(0.98)",
											opacity: "0.5",
										}}
										onMouseOver={() => {
											handleHover("search");
										}}
										onMouseOut={() => {
											handleMouseOut("search");
										}}
										onClick={() => {
											setIsSearchOpen(!isSearchOpen);
										}}
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										width='100%'
										fontSize='20px'
										leftIcon={
											<Icon
												as={IoMdSearch}
												color={isSearchHovered ? "#000" : "#8F8F8F"}
											/>
										}
										rightIcon={
											<Icon
												as={IoIosArrowDropdown}
												fontSize='18px'
												color={isSearchHovered ? "#000" : "#8F8F8F"}
												transform={
													isSearchOpen ? "rotate(-180deg)" : "rotate(0deg)"
												}
												transition='transform 0.15s ease'
											/>
										}
									>
										بحث
									</Button>
								</Box>

								{/* Additional Buttons For Search */}
								<Box>
									{isSearchOpen ? (
										<Flex gap='middle' vertical align='center'>
											<Box
												dir='rtl'
												display='flex'
												flexDirection='column'
												alignItems='flex-start'
												justifyContent='flex-start'
											>
												<NavigationLinkDrawer
													icon={FaPerson}
													text={"بحث عن المالك"}
													to={"/search-owner"}
													justifyContent='flex-end'
													alignItems='center'
												/>

												<NavigationLinkDrawer
													icon={MdOutlinePets}
													text={"بحث عن حيوان أليف"}
													to={"/search-pet"}
													justifyContent='flex-end'
													alignItems='center'
												/>
											</Box>
										</Flex>
									) : (
										<></>
									)}
								</Box>
							</Box>

							{/* Add Accordion */}
							<Box>
								{/* Add Button */}
								<Box
									dir='rtl'
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
									<Button
										_hover={{
											bg: "#D4F500",
											borderColor: "#D4F500",
											color: "#000",
											transform: "scale(1.05)",
										}}
										_active={{
											transform: "scale(0.98)",
											opacity: "0.5",
										}}
										onMouseOver={() => {
											handleHover("add");
										}}
										onMouseOut={() => {
											handleMouseOut("add");
										}}
										onClick={() => {
											setIsAddOpen(!isAddOpen);
										}}
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										fontSize='20px'
										width='100%'
										leftIcon={
											<Icon
												as={IoAdd}
												color={isAddHovered ? "#000" : "#8F8F8F"}
											/>
										}
										rightIcon={
											<Icon
												as={IoIosArrowDropdown}
												fontSize='18px'
												color={isAddHovered ? "#000" : "#8F8F8F"}
												transform={
													isAddOpen ? "rotate(-180deg)" : "rotate(0deg)"
												}
												transition='transform 0.15s ease'
											/>
										}
									>
										إضافة
									</Button>
								</Box>

								{/* Additional Buttons For Add */}
								<Box dir='rtl'>
									{isAddOpen ? (
										<Flex gap='middle' vertical align='center'>
											<Box
												display='flex'
												flexDirection='column'
												alignItems='flex-start'
												justifyContent='flex-start'
											>
												<NavigationLinkDrawer
													icon={FaPerson}
													text={"إضافة مالك"}
													to={"/add-owner"}
													justifyContent='flex-end'
													alignItems='flex-start'
												/>

												<NavigationLinkDrawer
													icon={MdOutlinePets}
													text={"إضافة حيوان أليف"}
													to={"/add-pet"}
													justifyContent='flex-end'
													alignItems='flex-start'
												/>
											</Box>
										</Flex>
									) : (
										<></>
									)}
								</Box>
							</Box>

							{/* Cases Accordion */}
							<Box>
								{/* Cases Button */}
								<Box
									dir='rtl'
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
									<Button
										_hover={{
											bg: "#D4F500",
											borderColor: "#D4F500",
											color: "#000",
											transform: "scale(1.05)",
										}}
										_active={{
											transform: "scale(0.98)",
											opacity: "0.5",
										}}
										onMouseOver={() => {
											handleHover("cases");
										}}
										onMouseOut={() => {
											handleMouseOut("cases");
										}}
										onClick={() => {
											setIsCasesOpen(!isCasesOpen);
										}}
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										fontSize='20px'
										width='100%'
										leftIcon={
											<Icon
												as={FaBuffer}
												color={isCasesHovered ? "#000" : "#8F8F8F"}
											/>
										}
										rightIcon={
											<Icon
												as={IoIosArrowDropdown}
												fontSize='18px'
												color={isCasesHovered ? "#000" : "#8F8F8F"}
												transform={
													isCasesOpen ? "rotate(-180deg)" : "rotate(0deg)"
												}
												transition='transform 0.15s ease'
											/>
										}
									>
										الحالات
									</Button>
								</Box>

								{/* Additional Buttons For Cases */}
								{role === "secretary" ? (
									<>
										<Box dir='rtl'>
											{isCasesOpen ? (
												<Flex gap='middle' vertical align='center'>
													<Box
														display='flex'
														flexDirection='column'
														alignItems='flex-start'
														justifyContent='flex-start'
													>
														<NavigationLinkDrawer
															icon={FaBookMedical}
															text={"testing"}
															to={"/view-cases"}
															justifyContent='flex-end'
															alignItems='flex-start'
														/>

														<NavigationLinkDrawer
															icon={BsFileMedical}
															text={"Check Assigned Cases"}
															to={"/assigned-cases"}
															justifyContent='flex-end'
															alignItems='flex-start'
														/>
													</Box>
												</Flex>
											) : (
												<></>
											)}
										</Box>
									</>
								) : (
									<Box dir='rtl'>
										{isCasesOpen ? (
											<Flex gap='middle' vertical align='center'>
												<Box
													display='flex'
													flexDirection='column'
													alignItems='flex-start'
													justifyContent='flex-start'
												>
													<NavigationLinkDrawer
														icon={FaBookMedical}
														text={"الحالات المفتوحة"}
														to={"/view-cases"}
														justifyContent='flex-end'
														alignItems='flex-start'
													/>

													<NavigationLinkDrawer
														icon={BsFileMedical}
														text={"الحالات الخاصة بي"}
														to={"/assigned-cases"}
														justifyContent='flex-end'
														alignItems='flex-start'
													/>
												</Box>
											</Flex>
										) : (
											<></>
										)}
									</Box>
								)}
							</Box>

							{/* Send Feedback Button */}
							<Box>
								<Box
									dir='rtl'
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
									<Button
										_hover={{
											bg: "#D4F500",
											borderColor: "#D4F500",
											color: "#000",
											transform: "scale(1.05)",
										}}
										onMouseOver={() => {
											handleHover("feedback");
										}}
										onMouseOut={() => {
											handleMouseOut("feedback");
										}}
										_active={{
											transform: "scale(0.98)",
											opacity: "0.5",
										}}
										onClick={() => {
											navigate("/send-feedback");
										}}
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										fontSize='18px'
										width='100%'
										leftIcon={
											<Icon
												as={VscFeedback}
												color={isFeedbackHovered ? "#000" : "#8F8F8F"}
											/>
										}
									>
										إرسال ملاحظات
									</Button>
								</Box>
							</Box>

							{/* Edit Profile Button */}
							<Box>
								<Box
									dir='rtl'
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
									<Button
										_hover={{
											bg: "#D4F500",
											borderColor: "#D4F500",
											color: "#000",
											transform: "scale(1.05)",
										}}
										onMouseOver={() => {
											handleHover("edit");
										}}
										onMouseOut={() => {
											handleMouseOut("edit");
										}}
										_active={{
											transform: "scale(0.98)",
											opacity: "0.5",
										}}
										onClick={() => {
											navigate("/edit-user");
										}}
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										fontSize='18px'
										width='100%'
										leftIcon={
											<Icon
												as={CiEdit}
												color={isEditHovered ? "#000" : "#8F8F8F"}
											/>
										}
									>
										تعديل الملف الشخصي
									</Button>
								</Box>
							</Box>

							{/* Change Password Button */}
							<Box>
								<Box
									dir='rtl'
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
								>
									<Button
										_hover={{
											bg: "#D4F500",
											borderColor: "#D4F500",
											color: "#000",
											transform: "scale(1.05)",
										}}
										onMouseOver={() => {
											handleHover("changePassword");
										}}
										onMouseOut={() => {
											handleMouseOut("changePassword");
										}}
										_active={{
											transform: "scale(0.98)",
											opacity: "0.5",
										}}
										onClick={() => {
											navigate("/change-password");
										}}
										justifyContent={"flex-start"}
										alignItems={"center"}
										transition='all 0.15s ease'
										bg='#121211'
										color='#8F8F8F'
										fontSize='18px'
										width='100%'
										leftIcon={
											<Icon
												as={MdOutlinePassword}
												color={isChangePasswordHovered ? "#000" : "#8F8F8F"}
											/>
										}
									>
										تغيير كلمة السر
									</Button>
								</Box>
							</Box>
						</Flex>
					</DrawerBody>

					<DrawerFooter color='#8F8F8F'>® Vetrik</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
}
