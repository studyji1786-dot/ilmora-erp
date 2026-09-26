import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Image,
  Linking,
  ActivityIndicator,
  Dimensions,
  Switch,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 20;

const SUPABASE_URL = 'https://jdozrzfiukdrusqcrfgw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4LQ2DiljJqBh1QCTiQ6Kbw_vN0wRoE8';

const headers = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

// MASTER OWNER SECRET CODE (100% Lifetime Free Access)
const MASTER_SUPER_ADMINS = ['9934094615313'];

const ALL_BATCHES = [
  'All',
  'Class 6th',
  'Class 7th',
  'Class 8th',
  'Class 9th',
  'Class 10th',
  'Class 11th',
  'Class 12th',
  'JEE Foundation',
  'NEET Dropper',
  'Commerce'
];

export default function App() {
  // SaaS Auth States
  const [authSession, setAuthSession] = useState(null);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'student'
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [loggedStudent, setLoggedStudent] = useState(null);

  // Admin PIN
  const [adminPin, setAdminPin] = useState('1234');
  const [enteredAdminPin, setEnteredAdminPin] = useState('');
  const [pinChangeModal, setPinChangeModal] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');

  // Subscription Pricing Plans
  const [selectedSaaSPlan, setSelectedSaaSPlan] = useState({ title: '1 Month Plan', amount: '50', days: 30 });
  const [paywallModal, setPaywallModal] = useState(false);

  // Admin Tab Navigation
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const horizontalScrollRef = useRef(null);

  // App Branding & UPI
  const [coachingName, setCoachingName] = useState('ILMORA');
  const [coachingTagline, setCoachingTagline] = useState('Tufee Multi-User ERP');
  const [coachingLogo, setCoachingLogo] = useState('');
  const [coachingUpiId, setCoachingUpiId] = useState('ilmora@upi');

  // Settings Fields
  const [inputCoachingName, setInputCoachingName] = useState('ILMORA');
  const [inputTagline, setInputTagline] = useState('Tufee Multi-User ERP');
  const [inputLogoUrl, setInputLogoUrl] = useState('');
  const [inputUpiId, setInputUpiId] = useState('ilmora@upi');
  const [advanceFeeToggle, setAdvanceFeeToggle] = useState(false);
  const [waMode, setWaMode] = useState('Personal'); // 'Personal' | 'Business'

  // Core Data States
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [testRecords, setTestRecords] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [staffList, setStaffList] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('All');

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feeReceiptStudent, setFeeReceiptStudent] = useState(null);
  const [admissionModal, setAdmissionModal] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState(false);
  const [testModal, setTestModal] = useState(false);
  const [materialModal, setMaterialModal] = useState(false);
  const [adminHomeworkModal, setAdminHomeworkModal] = useState(false);
  const [enquiryModal, setEnquiryModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [staffModal, setStaffModal] = useState(false);
  const [broadcastModal, setBroadcastModal] = useState(false);
  const [csvPreviewModal, setCsvPreviewModal] = useState(null);
  const [upiPaymentModal, setUpiPaymentModal] = useState(false);
  const [idCardModal, setIdCardModal] = useState(false);
  const [applyLeaveModal, setApplyLeaveModal] = useState(false);

  // Form Fields - Admission
  const [newName, setNewName] = useState('');
  const [newFather, setNewFather] = useState('');
  const [newRoll, setNewRoll] = useState('');
  const [newBatch, setNewBatch] = useState('Class 10th');
  const [customBatchInput, setCustomBatchInput] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newFee, setNewFee] = useState('1500');
  const [newAddress, setNewAddress] = useState('');
  const [newJoiningDate, setNewJoiningDate] = useState('2026-09-25');
  const [newPhotoBase64, setNewPhotoBase64] = useState(null);

  // Form Fields - Enquiries, Expenses, Staff
  const [enqName, setEnqName] = useState('');
  const [enqPhone, setEnqPhone] = useState('');
  const [enqBatch, setEnqBatch] = useState('Class 10th');
  const [enqFollowDate, setEnqFollowDate] = useState('2026-09-28');
  const [enqNotes, setEnqNotes] = useState('');
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState('Rent');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Teacher');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffSalary, setStaffSalary] = useState('15000');

  // Form Fields - Homework, Materials, Tests, Leaves, Broadcast
  const [hwSubject, setHwSubject] = useState('');
  const [hwBatch, setHwBatch] = useState('Class 10th');
  const [hwTitle, setHwTitle] = useState('');
  const [hwDueDate, setHwDueDate] = useState('2026-09-26');
  const [hwDesc, setHwDesc] = useState('');
  const [matTitle, setMatTitle] = useState('');
  const [matSubject, setMatSubject] = useState('');
  const [matBatch, setMatBatch] = useState('All');
  const [matUrl, setMatUrl] = useState('');
  const [matDesc, setMatDesc] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [testSubject, setTestSubject] = useState('');
  const [testMaxMarks, setTestMaxMarks] = useState('50');
  const [testStudentId, setTestStudentId] = useState('');
  const [testMarksObt, setTestMarksObt] = useState('');
  const [testRemarks, setTestRemarks] = useState('Good performance!');
  const [leaveFrom, setLeaveFrom] = useState('2026-09-26');
  const [leaveTo, setLeaveTo] = useState('2026-09-27');
  const [leaveReason, setLeaveReason] = useState('');
  const [bcBatch, setBcBatch] = useState('All');
  const [bcMessage, setBcMessage] = useState('');

  // Device Photo Picker
  const openDeviceGallery = (callback) => {
    if (Platform.OS === 'web' || typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => callback(event.target.result);
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  // Load All Cloud Data from 9 Backend Tables
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [stuRes, notRes, testRes, matRes, hwRes, leaveRes, enqRes, expRes, staffRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/students?select=*&order=id.desc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/notices?select=*&order=id.desc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/test_records?select=*&order=id.desc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/study_materials?select=*&order=id.desc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/homework?select=*&order=id.desc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/leave_applications?select=*&order=id.desc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/enquiries?select=*&order=id.desc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/expenses?select=*&order=id.desc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/staff_members?select=*&order=id.desc`, { headers })
      ]);

      const [stu, not, test, mat, hw, leave, enq, exp, staff] = await Promise.all([
        stuRes.json(), notRes.json(), testRes.json(), matRes.json(), hwRes.json(),
        leaveRes.json(), enqRes.json(), expRes.json(), staffRes.json()
      ]);

      if (Array.isArray(stu)) setStudents(stu);
      if (Array.isArray(not)) setNotices(not);
      if (Array.isArray(test)) setTestRecords(test);
      if (Array.isArray(mat)) setStudyMaterials(mat);
      if (Array.isArray(hw)) setHomeworkList(hw);
      if (Array.isArray(leave)) setLeaveRequests(leave);
      if (Array.isArray(enq)) setEnquiries(enq);
      if (Array.isArray(exp)) setExpenses(exp);
      if (Array.isArray(staff)) setStaffList(staff);
    } catch (err) {
      console.log('Supabase sync error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Admin Auth Handler
  const handleAdminAuth = () => {
    const id = loginIdentifier.trim().toLowerCase();
    if (!id) {
      alert('Kripya apna Login Code / Mobile number enter karein!');
      return;
    }

    if (MASTER_SUPER_ADMINS.includes(id)) {
      setAuthSession({
        identifier: id,
        role: 'admin',
        isMaster: true,
        trialDaysLeft: 9999,
        isExpired: false,
        planTitle: 'Master Lifetime Owner'
      });
      alert('Swagatam Master Owner! Aapke liye ILMORA 100% Lifetime Free hai.');
      return;
    }

    const trialDaysLeft = 7;
    const isExpired = trialDaysLeft <= 0;
    setAuthSession({
      identifier: id,
      role: 'admin',
      isMaster: false,
      trialDaysLeft,
      isExpired,
      planTitle: isExpired ? 'Expired' : '7 Days Free Trial'
    });

    if (isExpired) {
      setPaywallModal(true);
    } else {
      alert(`Login Successful! 7 Dino ka Free Trial Active hai (${trialDaysLeft} days remaining).`);
    }
  };

  // Parent Login Handler
  const handleParentLogin = () => {
    if (!studentCodeInput.trim()) {
      alert('Kripya Roll Number ya Student Code enter karein!');
      return;
    }
    const clean = studentCodeInput.trim().toLowerCase().replace('ilm-', '');
    const matched = students.find(s => 
      s.roll_no?.toString().toLowerCase() === clean ||
      s.roll_no?.toString().toLowerCase() === studentCodeInput.trim().toLowerCase()
    );
    if (matched) {
      setLoggedStudent(matched);
      setAuthSession({ role: 'parent', identifier: matched.name });
      setStudentCodeInput('');
    } else {
      alert('Student record nahi mila. Kripya sahi roll number enter karein.');
    }
  };

  // Pay Subscription
  const handlePaySubscription = () => {
    const upiLink = `upi://pay?pa=${coachingUpiId}&pn=ILMORA%20SaaS&am=${selectedSaaSPlan.amount}&cu=INR&tn=${encodeURIComponent('ILMORA ERP ' + selectedSaaSPlan.title)}`;
    Linking.openURL(upiLink).catch(() => {
      alert(`UPI app open nahi hua. UPI ID: ${coachingUpiId} par ₹${selectedSaaSPlan.amount} transfer karein.`);
    });
    if (authSession) {
      setAuthSession({
        ...authSession,
        trialDaysLeft: selectedSaaSPlan.days,
        isExpired: false,
        planTitle: selectedSaaSPlan.title
      });
    }
    setPaywallModal(false);
    alert(`${selectedSaaSPlan.title} (₹${selectedSaaSPlan.amount}) payment request initiated!`);
  };

  // Universal WhatsApp Sender
  const openWhatsAppUniversal = (phone, msg) => {
    if (!phone) {
      alert('Mobile number uplabdh nahi hai!');
      return;
    }
    let clean = phone.replace(/[^0-9]/g, '');
    if (!clean.startsWith('91') && clean.length === 10) clean = '91' + clean;
    const enc = encodeURIComponent(msg);
    if (waMode === 'Business') {
      Linking.openURL(`whatsapp://send?phone=${clean}&text=${enc}`).catch(() => {
        Linking.openURL(`https://wa.me/${clean}?text=${enc}`);
      });
    } else {
      Linking.openURL(`https://wa.me/${clean}?text=${enc}`).catch(() => {
        Linking.openURL(`whatsapp://send?phone=${clean}&text=${enc}`);
      });
    }
  };

  // Tab Swiping
  const handleTabPress = (idx) => {
    setActiveTabIdx(idx);
    if (horizontalScrollRef.current) {
      horizontalScrollRef.current.scrollTo({ x: idx * SCREEN_WIDTH, animated: true });
    }
  };

  const handleScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const idx = Math.round(offsetX / SCREEN_WIDTH);
    if (idx !== activeTabIdx) setActiveTabIdx(idx);
  };

  // Admission Handler
  const handleAdmission = async () => {
    if (!newName.trim() || !newRoll.trim() || !newPhone.trim()) {
      alert('Kripya Name, Roll No aur Phone number bharein!');
      return;
    }
    const finalBatch = customBatchInput.trim() ? customBatchInput.trim() : newBatch;
    const payload = {
      name: newName.trim(),
      father_name: newFather.trim() || 'N/A',
      roll_no: newRoll.trim(),
      batch: finalBatch,
      phone: newPhone.trim().startsWith('91') ? newPhone.trim() : '91' + newPhone.trim(),
      monthly_fee: newFee.trim() || '1500',
      address: newAddress.trim() || 'N/A',
      photo_url: newPhotoBase64 || null,
      joining_date: newJoiningDate || '2026-09-25',
      fee_status: 'Pending',
      attendance: 'P'
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/students`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=representation' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setStudents([data[0], ...students]);
        setNewName('');
        setNewFather('');
        setNewRoll('');
        setNewPhone('');
        setNewAddress('');
        setCustomBatchInput('');
        setNewPhotoBase64(null);
        setAdmissionModal(false);
      }
    } catch (e) {
      alert('Admission record save nahi ho saka.');
    }
  };

  // Attendance Toggle + History Logging
  const toggleAttendance = async (student) => {
    const nextStatus = student.attendance === 'P' ? 'A' : 'P';
    const today = new Date().toISOString().split('T')[0];
    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, attendance: nextStatus } : s));
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/students?id=eq.${student.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ attendance: nextStatus })
      });
      await fetch(`${SUPABASE_URL}/rest/v1/attendance_logs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ student_id: student.id, student_name: student.name, status: nextStatus, date: today })
      });
    } catch (err) {
      console.log('Attendance log sync error:', err);
    }
  };

  // Fee Toggle
  const toggleFeeStatus = async (student) => {
    const nextStatus = student.fee_status === 'Paid' ? 'Pending' : 'Paid';
    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, fee_status: nextStatus } : s));
    if (feeReceiptStudent && feeReceiptStudent.id === student.id) {
      setFeeReceiptStudent({ ...feeReceiptStudent, fee_status: nextStatus });
    }
    if (loggedStudent && loggedStudent.id === student.id) {
      setLoggedStudent({ ...loggedStudent, fee_status: nextStatus });
    }
    await fetch(`${SUPABASE_URL}/rest/v1/students?id=eq.${student.id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ fee_status: nextStatus })
    });
  };

  // Delete Student
  const handleDeleteStudent = async (id) => {
    setStudents(students.filter(s => s.id !== id));
    setSelectedStudent(null);
    await fetch(`${SUPABASE_URL}/rest/v1/students?id=eq.${id}`, { method: 'DELETE', headers });
  };

  // Test Score Handler
  const handleSaveTestScore = async () => {
    if (!testTitle.trim() || !testSubject.trim() || !testMarksObt.trim() || !testStudentId) {
      alert('Kripya Title, Subject, Student aur Marks bharein!');
      return;
    }
    const matched = students.find(s => String(s.id) === String(testStudentId));
    const payload = {
      test_title: testTitle.trim(),
      subject: testSubject.trim(),
      max_marks: testMaxMarks.trim() || '50',
      test_date: new Date().toLocaleDateString(),
      student_id: testStudentId,
      student_name: matched ? matched.name : 'Student',
      marks_obtained: testMarksObt.trim(),
      feedback: testRemarks.trim() || 'Good performance!'
    };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/test_records`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      setTestRecords([data[0], ...testRecords]);
      setTestMarksObt('');
      setTestModal(false);
      alert('Test score save ho gaya!');
    }
  };

  // Homework Publish Handler
  const handleSaveHomework = async () => {
    if (!hwTitle.trim() || !hwSubject.trim()) {
      alert('Kripya Subject aur Task title likhein!');
      return;
    }
    const payload = {
      subject: hwSubject.trim(),
      batch_target: hwBatch,
      task_title: hwTitle.trim(),
      due_date: hwDueDate,
      description: hwDesc.trim() || 'Complete in homework notebook'
    };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/homework`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      setHomeworkList([data[0], ...homeworkList]);
      setHwTitle('');
      setHwSubject('');
      setHwDesc('');
      setAdminHomeworkModal(false);
      alert('Homework publish ho gaya!');
    }
  };

  // Study Material Notes Handler
  const handleSaveMaterial = async () => {
    if (!matTitle.trim() || !matUrl.trim()) {
      alert('Kripya Title aur PDF link bharein!');
      return;
    }
    const payload = {
      title: matTitle.trim(),
      subject: matSubject.trim() || 'General',
      batch_target: matBatch,
      file_url: matUrl.trim(),
      description: matDesc.trim() || 'Study notes'
    };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/study_materials`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      setStudyMaterials([data[0], ...studyMaterials]);
      setMatTitle('');
      setMatUrl('');
      setMaterialModal(false);
      alert('Notes / PDF publish ho gaya!');
    }
  };

  // Leave Approval Handler
  const handleUpdateLeaveStatus = async (leaveId, newStatus) => {
    setLeaveRequests(prev => prev.map(l => l.id === leaveId ? { ...l, status: newStatus } : l));
    await fetch(`${SUPABASE_URL}/rest/v1/leave_applications?id=eq.${leaveId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: newStatus })
    });
  };

  // Calculations
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.attendance === 'P').length;
  const pendingFeesCount = students.filter(s => s.fee_status === 'Pending').length;

  let totalCollectedFees = 0;
  let totalPendingFees = 0;
  students.forEach(s => {
    const val = parseInt(s.monthly_fee || '1500', 10) || 1500;
    if (s.fee_status === 'Paid') totalCollectedFees += val;
    else totalPendingFees += val;
  });

  const totalExpenseSum = expenses.reduce((acc, curr) => acc + (parseInt(curr.amount, 10) || 0), 0);
  const netProfit = totalCollectedFees - totalExpenseSum;
  const attendancePercent = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const filteredStudents = students.filter(s => {
    const matchSearch = s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll_no?.includes(searchQuery);
    const matchBatch = selectedBatchFilter === 'All' || s.batch === selectedBatchFilter;
    return matchSearch && matchBatch;
  });

  // -------------------------------------------------------------
  // SCREEN 1: LOGIN & AUTH GATEWAY
  // -------------------------------------------------------------
  if (authSession === null) {
    return (
      <SafeAreaView style={[styles.container, styles.safeTopPadding, { paddingHorizontal: 20, justifyContent: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#11141B" translucent={false} />

        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          {coachingLogo ? (
            <Image source={{ uri: coachingLogo }} style={[styles.avatarLargeCircle, { borderWidth: 2, borderColor: '#F59E0B' }]} />
          ) : (
            <View style={styles.avatarLargeCircle}>
              <Text style={{ fontSize: 32, color: '#F59E0B', fontWeight: '900' }}>{coachingName.charAt(0)}</Text>
            </View>
          )}
          <Text style={[styles.instituteTitle, { fontSize: 24, marginTop: 10 }]}>{coachingName} ERP</Text>
          <Text style={styles.dimSubText}>Multi-Coaching SaaS Platform • 7 Days Free Trial</Text>
        </View>

        <View style={{ flexDirection: 'row', backgroundColor: '#1A1E29', borderRadius: 10, padding: 4, marginBottom: 16 }}>
          <TouchableOpacity
            style={[styles.switchRoleTab, authMode !== 'student' && styles.switchRoleTabActive]}
            onPress={() => setAuthMode('login')}
          >
            <Text style={[styles.switchRoleText, authMode !== 'student' && { color: '#000', fontWeight: '800' }]}>Coaching Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchRoleTab, authMode === 'student' && styles.switchRoleTabActive]}
            onPress={() => setAuthMode('student')}
          >
            <Text style={[styles.switchRoleText, authMode === 'student' && { color: '#000', fontWeight: '800' }]}>Parent / Student</Text>
          </TouchableOpacity>
        </View>

        {authMode !== 'student' ? (
          <View style={styles.darkModalCard}>
            <Text style={styles.sectionHeading}>Coaching Login / Registration</Text>
            <Text style={{ color: '#94A3B8', fontSize: 11, marginVertical: 6 }}>
              Gmail ID, Mobile number ya Master Code enter karein:
            </Text>

            <Text style={styles.darkInputLabel}>Login Code / Mobile / Email *</Text>
            <TextInput
              style={styles.darkInput}
              placeholder="e.g. director@coaching.com ya phone number"
              placeholderTextColor="#64748B"
              value={loginIdentifier}
              onChangeText={setLoginIdentifier}
              autoCapitalize="none"
            />

            <Text style={styles.darkInputLabel}>Password / PIN</Text>
            <TextInput
              style={styles.darkInput}
              placeholder="••••••••"
              placeholderTextColor="#64748B"
              secureTextEntry
              value={loginPassword}
              onChangeText={setLoginPassword}
            />

            <TouchableOpacity style={styles.goldPrimaryBtn} onPress={handleAdminAuth}>
              <Text style={styles.goldPrimaryBtnText}>Login / Start 7 Days Free Trial ›</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.darkModalCard}>
            <Text style={styles.sectionHeading}>Parent & Student Portal</Text>
            <Text style={{ color: '#94A3B8', fontSize: 11, marginVertical: 6 }}>
              Apne bachhe ka Roll Number ya Student Code enter karein:
            </Text>

            <TextInput
              style={styles.darkInput}
              placeholder="Roll No (e.g. 101 ya ILM-101)"
              placeholderTextColor="#64748B"
              value={studentCodeInput}
              onChangeText={setStudentCodeInput}
            />

            <TouchableOpacity style={styles.goldPrimaryBtn} onPress={handleParentLogin}>
              <Text style={styles.goldPrimaryBtnText}>Access Student Portal ›</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 2: SUBSCRIPTION PAYWALL
  // -------------------------------------------------------------
  if (authSession.role === 'admin' && !authSession.isMaster && authSession.isExpired) {
    return (
      <SafeAreaView style={[styles.container, styles.safeTopPadding, { paddingHorizontal: 20, justifyContent: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#11141B" translucent={false} />
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Ionicons name="lock-closed" size={48} color="#EF4444" />
          <Text style={[styles.instituteTitle, { fontSize: 22, marginTop: 10 }]}>7 Days Free Trial Expired</Text>
          <Text style={[styles.dimSubText, { textAlign: 'center', marginTop: 4 }]}>
            Aapka 7 dino ka free trial samapt ho chuka hai. App continue use karne ke liye subscription plan chunein:
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          {[
            { title: '1 Month Access', amount: '50', days: 30, desc: 'Monthly Coaching Plan' },
            { title: '6 Months Access', amount: '280', days: 180, desc: 'Half-Yearly Saver Plan' },
            { title: '1 Year Access', amount: '500', days: 365, desc: 'Most Popular Annual Plan' },
            { title: 'Lifetime Access', amount: '4500', days: 9999, desc: 'One-Time Payment Forever' }
          ].map((plan) => (
            <TouchableOpacity
              key={plan.amount}
              style={[
                styles.planSelectCard,
                selectedSaaSPlan.amount === plan.amount && { borderColor: '#F59E0B', backgroundColor: '#F59E0B11' }
              ]}
              onPress={() => setSelectedSaaSPlan(plan)}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700' }}>{plan.title}</Text>
                <Text style={styles.dimSubText}>{plan.desc}</Text>
              </View>
              <Text style={{ color: '#F59E0B', fontSize: 18, fontWeight: '900' }}>₹{plan.amount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.goldPrimaryBtn} onPress={handlePaySubscription}>
          <Text style={styles.goldPrimaryBtnText}>Pay ₹{selectedSaaSPlan.amount} & Unlock App Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 14, alignItems: 'center' }} onPress={() => setAuthSession(null)}>
          <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '700' }}>Switch Account / Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 3: DEDICATED PARENT & STUDENT PORTAL
  // -------------------------------------------------------------
  if (authSession.role === 'parent' && loggedStudent) {
    const studentTests = testRecords.filter(t => String(t.student_id) === String(loggedStudent.id));
    const studentMaterials = studyMaterials.filter(m => m.batch_target === 'All' || m.batch_target === loggedStudent.batch);
    const studentHomework = homeworkList.filter(h => h.batch_target === 'All' || h.batch_target === loggedStudent.batch);
    const myLeaveApplications = leaveRequests.filter(l => String(l.student_id) === String(loggedStudent.id));

    let avgPercentage = 0;
    if (studentTests.length > 0) {
      const sumPct = studentTests.reduce((acc, curr) => acc + (parseFloat(curr.marks_obtained) / parseFloat(curr.max_marks || 50)) * 100, 0);
      avgPercentage = Math.round(sumPct / studentTests.length);
    }

    const pendingAmount = loggedStudent.monthly_fee || '1500';
    const upiString = `upi://pay?pa=${coachingUpiId}&pn=${encodeURIComponent(coachingName)}&am=${pendingAmount}&cu=INR&tn=${encodeURIComponent('Fees for ' + loggedStudent.name)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;

    return (
      <SafeAreaView style={[styles.container, styles.safeTopPadding]}>
        <StatusBar barStyle="light-content" backgroundColor="#11141B" translucent={false} />
        <View style={styles.topHeader}>
          <View style={styles.headerLeft}>
            {loggedStudent.photo_url ? (
              <Image source={{ uri: loggedStudent.photo_url }} style={styles.avatarCircle} />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarCircleText}>{loggedStudent.name.charAt(0)}</Text>
              </View>
            )}
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.instituteTitle}>{loggedStudent.name}</Text>
              <Text style={styles.instituteSubtitle}>Roll #{loggedStudent.roll_no} • {loggedStudent.batch}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity style={styles.goldMiniBtn} onPress={() => setIdCardModal(true)}>
              <Ionicons name="card" size={13} color="#000" />
              <Text style={styles.goldMiniBtnText}>ID Card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.goldMiniBtn, { backgroundColor: '#262D3D' }]} onPress={() => setAuthSession(null)}>
              <Text style={{ color: '#F87171', fontSize: 11, fontWeight: '700' }}>Logout ↩</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
          {/* Quick Action Pills */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            <TouchableOpacity style={[styles.quickActionCardPill, { backgroundColor: '#1E2433' }]} onPress={() => setIdCardModal(true)}>
              <Ionicons name="id-card-outline" size={18} color="#F59E0B" />
              <Text style={styles.pillActionText}>Virtual ID Card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickActionCardPill, { backgroundColor: '#1E2433' }]} onPress={() => setApplyLeaveModal(true)}>
              <Ionicons name="calendar-outline" size={18} color="#10B981" />
              <Text style={styles.pillActionText}>Apply Leave</Text>
            </TouchableOpacity>
          </View>

          {/* Monthly Tuition Fee & Attendance */}
          <View style={styles.cardContainer}>
            <View style={styles.cardTitleBetween}>
              <View>
                <Text style={styles.dimSubText}>Monthly Tuition Fee</Text>
                <Text style={{ color: loggedStudent.fee_status === 'Paid' ? '#34D399' : '#F59E0B', fontSize: 18, fontWeight: '800' }}>
                  ₹{pendingAmount} ({loggedStudent.fee_status === 'Paid' ? 'PAID ✅' : 'DUE / PENDING ⚠️'})
                </Text>
              </View>
              <View style={[styles.statusToggleBtn, { backgroundColor: loggedStudent.attendance === 'P' ? '#10B981' : '#EF4444' }]}>
                <Text style={styles.statusToggleText}>{loggedStudent.attendance === 'P' ? 'PRESENT TODAY' : 'ABSENT TODAY'}</Text>
              </View>
            </View>

            {loggedStudent.fee_status !== 'Paid' && (
              <TouchableOpacity style={[styles.goldPrimaryBtn, { marginTop: 12 }]} onPress={() => setUpiPaymentModal(true)}>
                <Text style={styles.goldPrimaryBtnText}>💳 Pay Online via UPI / QR (₹{pendingAmount})</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Exam Analytics & Marks Progression */}
          <View style={styles.cardContainer}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Exam Performance Analytics</Text>
              <Text style={{ color: '#F59E0B', fontWeight: '800' }}>Overall: {avgPercentage}%</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={styles.dimSubText}>Average Test Accuracy</Text>
                <Text style={{ color: '#F59E0B', fontWeight: '800', fontSize: 12 }}>{avgPercentage}% Marks</Text>
              </View>
              <View style={{ height: 6, backgroundColor: '#262D3D', borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${avgPercentage}%`, backgroundColor: '#F59E0B' }} />
              </View>
            </View>

            {studentTests.map(t => (
              <View key={t.id} style={[styles.darkItemCard, { marginTop: 8, marginBottom: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemMainName}>{t.test_title} ({t.subject})</Text>
                  <Text style={styles.dimSubText}>{t.feedback} • {t.test_date}</Text>
                </View>
                <Text style={{ color: '#F59E0B', fontWeight: '800' }}>{t.marks_obtained}/{t.max_marks}</Text>
              </View>
            ))}
          </View>

          {/* Daily Homework */}
          <View style={styles.cardContainer}>
            <Text style={styles.sectionHeading}>Daily Homework & Tasks</Text>
            {studentHomework.length === 0 ? (
              <Text style={{ color: '#64748B', fontSize: 12, marginTop: 8 }}>Koi pending homework nahi hai.</Text>
            ) : (
              studentHomework.map(hw => (
                <View key={hw.id} style={[styles.darkItemCard, { marginTop: 8, marginBottom: 0, flexDirection: 'column', alignItems: 'flex-start' }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <Text style={{ color: '#F59E0B', fontWeight: '700' }}>{hw.subject}</Text>
                    <Text style={{ color: '#EF4444', fontSize: 10 }}>Due: {hw.due_date}</Text>
                  </View>
                  <Text style={[styles.itemMainName, { marginTop: 4 }]}>{hw.task_title}</Text>
                  <Text style={styles.dimSubText}>{hw.description}</Text>
                </View>
              ))
            )}
          </View>

          {/* My Leave Applications */}
          <View style={styles.cardContainer}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>My Leave Applications</Text>
              <TouchableOpacity onPress={() => setApplyLeaveModal(true)}>
                <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '700' }}>+ Apply Leave</Text>
              </TouchableOpacity>
            </View>
            {myLeaveApplications.map(lv => (
              <View key={lv.id} style={[styles.darkItemCard, { marginTop: 8, marginBottom: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemMainName}>{lv.from_date} se {lv.to_date}</Text>
                  <Text style={styles.dimSubText}>Reason: {lv.reason}</Text>
                </View>
                <View style={{ backgroundColor: lv.status === 'Approved' ? '#064E3B' : '#78350F', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ color: lv.status === 'Approved' ? '#34D399' : '#FCD34D', fontSize: 10, fontWeight: '800' }}>{lv.status}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Study Notes & PDFs */}
          <View style={styles.cardContainer}>
            <Text style={styles.sectionHeading}>Class Notes & PDFs</Text>
            {studentMaterials.map(m => (
              <View key={m.id} style={[styles.darkItemCard, { marginTop: 8, marginBottom: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemMainName}>{m.title}</Text>
                  <Text style={styles.dimSubText}>{m.subject} • {m.description}</Text>
                </View>
                <TouchableOpacity style={styles.goldActionBtnSmall} onPress={() => Linking.openURL(m.file_url)}>
                  <Ionicons name="download-outline" size={14} color="#000" />
                  <Text style={styles.goldActionBtnText}>PDF</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Digital ID Card Modal */}
        <Modal visible={idCardModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.darkModalCard, { padding: 0, overflow: 'hidden', borderWidth: 2, borderColor: '#F59E0B' }]}>
              <View style={{ backgroundColor: '#F59E0B', padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#000', fontSize: 16, fontWeight: '900' }}>{coachingName} ID CARD</Text>
                <TouchableOpacity onPress={() => setIdCardModal(false)}><Ionicons name="close-circle" size={24} color="#000" /></TouchableOpacity>
              </View>
              <View style={{ padding: 20, alignItems: 'center' }}>
                {loggedStudent.photo_url ? (
                  <Image source={{ uri: loggedStudent.photo_url }} style={[styles.avatarLargeCircle, { marginBottom: 10 }]} />
                ) : (
                  <View style={[styles.avatarLargeCircle, { marginBottom: 10 }]}>
                    <Text style={{ fontSize: 32, fontWeight: '800', color: '#F59E0B' }}>{loggedStudent.name.charAt(0)}</Text>
                  </View>
                )}
                <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '800' }}>{loggedStudent.name}</Text>
                <Text style={{ color: '#F59E0B', fontSize: 12, marginTop: 2 }}>STUDENT CODE: ILM-{loggedStudent.roll_no}</Text>
                <View style={{ width: '100%', backgroundColor: '#11141B', borderRadius: 8, padding: 10, marginTop: 12, gap: 4 }}>
                  <View style={styles.detailRow}><Text style={styles.dimSubText}>Roll No:</Text><Text style={styles.brightVal}>#{loggedStudent.roll_no}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.dimSubText}>Batch:</Text><Text style={styles.brightVal}>{loggedStudent.batch}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.dimSubText}>Phone:</Text><Text style={styles.brightVal}>+{loggedStudent.phone}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.dimSubText}>Joining:</Text><Text style={styles.brightVal}>{loggedStudent.joining_date}</Text></View>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Apply Leave Modal */}
        <Modal visible={applyLeaveModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.darkModalCard}>
              <View style={styles.cardTitleBetween}>
                <Text style={styles.sectionHeading}>Apply Leave (Chhutti)</Text>
                <TouchableOpacity onPress={() => setApplyLeaveModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
              </View>
              <TextInput style={[styles.darkInput, { marginTop: 12 }]} placeholder="From (YYYY-MM-DD)" placeholderTextColor="#64748B" value={leaveFrom} onChangeText={setLeaveFrom} />
              <TextInput style={styles.darkInput} placeholder="To (YYYY-MM-DD)" placeholderTextColor="#64748B" value={leaveTo} onChangeText={setLeaveTo} />
              <TextInput style={[styles.darkInput, { height: 70 }]} multiline placeholder="Reason for leave" placeholderTextColor="#64748B" value={leaveReason} onChangeText={setLeaveReason} />
              <TouchableOpacity style={styles.goldPrimaryBtn} onPress={async () => {
                if (!leaveReason.trim()) return;
                await fetch(`${SUPABASE_URL}/rest/v1/leave_applications`, {
                  method: 'POST',
                  headers: { ...headers, Prefer: 'return=representation' },
                  body: JSON.stringify({
                    student_id: loggedStudent.id,
                    student_name: loggedStudent.name,
                    batch: loggedStudent.batch,
                    from_date: leaveFrom,
                    to_date: leaveTo,
                    reason: leaveReason.trim(),
                    status: 'Pending'
                  })
                });
                setLeaveReason('');
                setApplyLeaveModal(false);
                alert('Leave application submitted!');
                loadInitialData();
              }}>
                <Text style={styles.goldPrimaryBtnText}>Submit Leave</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* UPI Payment Modal */}
        <Modal visible={upiPaymentModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.darkModalCard, { alignItems: 'center' }]}>
              <View style={[styles.cardTitleBetween, { width: '100%' }]}>
                <Text style={styles.sectionHeading}>Pay Fees Online</Text>
                <TouchableOpacity onPress={() => setUpiPaymentModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
              </View>
              <View style={{ backgroundColor: '#FFF', padding: 10, borderRadius: 12, marginVertical: 14 }}>
                <Image source={{ uri: qrCodeUrl }} style={{ width: 180, height: 180 }} />
              </View>
              <Text style={{ color: '#F59E0B', fontSize: 20, fontWeight: '800' }}>₹{pendingAmount}</Text>
              <TouchableOpacity style={styles.goldPrimaryBtn} onPress={() => Linking.openURL(upiString)}>
                <Text style={styles.goldPrimaryBtnText}>Open in GPay / PhonePe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 4: FULL ADMIN CONTROLLER DASHBOARD
  // -------------------------------------------------------------
  return (
    <SafeAreaView style={[styles.container, styles.safeTopPadding]}>
      <StatusBar barStyle="light-content" backgroundColor="#11141B" translucent={false} />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          {coachingLogo ? (
            <Image source={{ uri: coachingLogo }} style={[styles.avatarCircle, { borderWidth: 1, borderColor: '#F59E0B' }]} />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarCircleText}>{coachingName.charAt(0)}</Text>
            </View>
          )}
          <View style={{ marginLeft: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.instituteTitle}>{coachingName}</Text>
              <View style={{ backgroundColor: authSession.isMaster ? '#10B98122' : '#F59E0B22', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ color: authSession.isMaster ? '#34D399' : '#F59E0B', fontSize: 9, fontWeight: '800' }}>
                  {authSession.isMaster ? 'LIFETIME MASTER' : `TRIAL: ${authSession.trialDaysLeft}d`}
                </Text>
              </View>
            </View>
            <Text style={styles.instituteSubtitle}>{coachingTagline}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity onPress={() => setBroadcastModal(true)} style={{ padding: 6 }}>
            <Ionicons name="megaphone" size={18} color="#F59E0B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabPress(7)} style={{ padding: 6 }}>
            <Ionicons name="settings-sharp" size={18} color="#F59E0B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAuthSession(null)} style={{ padding: 6 }}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={styles.loadingText}>Syncing {coachingName} ERP...</Text>
        </View>
      ) : (
        <ScrollView
          ref={horizontalScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          style={{ flex: 1 }}
        >
          {/* TAB 0: OVERVIEW & CASHBOOK */}
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
              <View style={[styles.subscriptionBannerContainer, authSession.isMaster && { borderColor: '#10B98166' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
                  <Ionicons name={authSession.isMaster ? "shield-checkmark" : "timer"} size={20} color={authSession.isMaster ? "#10B981" : "#F59E0B"} />
                  <View>
                    <Text style={styles.subMainHeading}>
                      {authSession.isMaster ? 'Master Owner License: Lifetime Free Access' : `7-Days Free Trial: ${authSession.trialDaysLeft} Days Remaining`}
                    </Text>
                    <Text style={styles.dimSubText}>All Cloud Tables & Features Live</Text>
                  </View>
                </View>
                {!authSession.isMaster && (
                  <TouchableOpacity style={styles.renewNowActionBtn} onPress={() => setPaywallModal(true)}>
                    <Text style={styles.renewNowActionText}>Buy Plan</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Cashbook Card */}
              <View style={[styles.cardContainer, { borderColor: '#F59E0B66' }]}>
                <Text style={styles.sectionHeading}>Financial Cashbook & Net Balance</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                  <View>
                    <Text style={{ color: '#10B981', fontSize: 16, fontWeight: '800' }}>₹{totalCollectedFees}</Text>
                    <Text style={styles.dimSubText}>Fee Collected</Text>
                  </View>
                  <View>
                    <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: '800' }}>- ₹{totalExpenseSum}</Text>
                    <Text style={styles.dimSubText}>Expenses</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#F59E0B', fontSize: 18, fontWeight: '900' }}>₹{netProfit}</Text>
                    <Text style={styles.dimSubText}>Net in Hand</Text>
                  </View>
                </View>
              </View>

              {/* Attendance Chart Summary */}
              <View style={styles.cardContainer}>
                <View style={styles.cardTitleBetween}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="trending-up-outline" size={16} color="#F59E0B" />
                    <Text style={styles.sectionHeading}>Attendance Summary</Text>
                  </View>
                  <Text style={{ color: '#F59E0B', fontWeight: '700', fontSize: 12 }}>Sep-2026</Text>
                </View>
                <View style={{ marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={styles.dimSubText}>Daily Attendance Rate</Text>
                    <Text style={{ color: '#F59E0B', fontWeight: '800', fontSize: 12 }}>{attendancePercent}% ({presentCount}/{totalStudents})</Text>
                  </View>
                  <View style={{ height: 6, backgroundColor: '#262D3D', borderRadius: 3, overflow: 'hidden' }}>
                    <View style={{ height: '100%', width: `${attendancePercent}%`, backgroundColor: '#F59E0B' }} />
                  </View>
                </View>
              </View>

              {/* Pending Leave Requests */}
              {leaveRequests.filter(l => l.status === 'Pending').length > 0 && (
                <View style={[styles.cardContainer, { borderColor: '#F59E0B88' }]}>
                  <Text style={[styles.sectionHeading, { color: '#F59E0B' }]}>Pending Leave Requests</Text>
                  {leaveRequests.filter(l => l.status === 'Pending').map(l => (
                    <View key={l.id} style={[styles.darkItemCard, { marginTop: 8, marginBottom: 0 }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemMainName}>{l.student_name} ({l.batch})</Text>
                        <Text style={styles.dimSubText}>{l.from_date} to {l.to_date} • {l.reason}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        <TouchableOpacity style={[styles.goldMiniBtn, { backgroundColor: '#10B981' }]} onPress={() => handleUpdateLeaveStatus(l.id, 'Approved')}>
                          <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800' }}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.goldMiniBtn, { backgroundColor: '#EF4444' }]} onPress={() => handleUpdateLeaveStatus(l.id, 'Rejected')}>
                          <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800' }}>Reject</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Overview Counts */}
              <View style={styles.cardContainer}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardHeadColLeft}>Overview</Text>
                  <Text style={styles.cardHeadCol}>Active</Text>
                  <Text style={styles.cardHeadCol}>Total</Text>
                </View>
                <View style={styles.cardDataRow}>
                  <View style={styles.cardDataLeft}><Ionicons name="people" size={16} color="#F59E0B" /><Text style={styles.cardLabelText}>Students</Text></View>
                  <Text style={styles.cardValText}>{presentCount}</Text><Text style={styles.cardValText}>{totalStudents}</Text>
                </View>
                <View style={styles.cardDataRow}>
                  <View style={styles.cardDataLeft}><Ionicons name="call" size={16} color="#F59E0B" /><Text style={styles.cardLabelText}>Enquiries</Text></View>
                  <Text style={styles.cardValText}>{enquiries.length}</Text><Text style={styles.cardValText}>{enquiries.length}</Text>
                </View>
                <View style={styles.cardDataRow}>
                  <View style={styles.cardDataLeft}><Ionicons name="briefcase" size={16} color="#F59E0B" /><Text style={styles.cardLabelText}>Staff</Text></View>
                  <Text style={styles.cardValText}>{staffList.length}</Text><Text style={styles.cardValText}>{staffList.length}</Text>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* TAB 1: STUDENTS REGISTRY */}
          <View style={{ width: SCREEN_WIDTH, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1E29', borderRadius: 10, paddingHorizontal: 10, borderWidth: 1, borderColor: '#262D3D', marginBottom: 12 }}>
              <Ionicons name="search" size={18} color="#94A3B8" />
              <TextInput style={{ flex: 1, paddingVertical: 8, color: '#FFF', fontSize: 13, marginLeft: 8 }} placeholder="Search student name or roll..." placeholderTextColor="#64748B" value={searchQuery} onChangeText={setSearchQuery} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {ALL_BATCHES.map(b => (
                <TouchableOpacity
                  key={b}
                  onPress={() => setSelectedBatchFilter(b)}
                  style={[styles.darkChip, selectedBatchFilter === b && styles.darkChipActive, { marginRight: 6 }]}
                >
                  <Text style={[styles.darkChipText, selectedBatchFilter === b && { color: '#000' }]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Students ({filteredStudents.length})</Text>
              <TouchableOpacity onPress={() => setAdmissionModal(true)} style={styles.goldMiniBtn}><Text style={styles.goldMiniBtnText}>+ Add</Text></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }} style={{ marginTop: 12 }}>
              {filteredStudents.map(item => (
                <View key={item.id} style={styles.darkItemCard}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelectedStudent(item)}>
                    <Text style={styles.itemMainName}>{item.name} ↗</Text>
                    <Text style={styles.dimSubText}>Roll #{item.roll_no} • {item.batch}</Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity onPress={() => toggleAttendance(item)} style={[styles.statusToggleBtn, { backgroundColor: item.attendance === 'P' ? '#10B981' : '#EF4444' }]}>
                      <Text style={styles.statusToggleText}>{item.attendance === 'P' ? 'PRESENT' : 'ABSENT'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleFeeStatus(item)} style={[styles.statusToggleBtn, { backgroundColor: item.fee_status === 'Paid' ? '#064E3B' : '#450A0A' }]}>
                      <Text style={[styles.statusToggleText, { color: item.fee_status === 'Paid' ? '#34D399' : '#F87171' }]}>{item.fee_status}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* TAB 2: ENQUIRIES / LEADS */}
          <View style={{ width: SCREEN_WIDTH, padding: 16 }}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Admission Leads ({enquiries.length})</Text>
              <TouchableOpacity onPress={() => setEnquiryModal(true)} style={styles.goldMiniBtn}><Text style={styles.goldMiniBtnText}>+ Lead</Text></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }} style={{ marginTop: 12 }}>
              {enquiries.map(enq => (
                <View key={enq.id} style={styles.darkItemCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemMainName}>{enq.student_name} ({enq.batch_interested})</Text>
                    <Text style={styles.dimSubText}>Follow: {enq.follow_up_date} • {enq.notes}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity style={[styles.goldMiniBtn, { backgroundColor: '#25D366' }]} onPress={() => openWhatsAppUniversal(enq.phone, `Namaste, ${coachingName} admission follow up.`)}>
                      <Ionicons name="logo-whatsapp" size={13} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.goldMiniBtn} onPress={() => Linking.openURL(`tel:+${enq.phone}`)}>
                      <Ionicons name="call" size={13} color="#000" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* TAB 3: EXPENSES & CASHBOOK */}
          <View style={{ width: SCREEN_WIDTH, padding: 16 }}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Expenses Register</Text>
              <TouchableOpacity onPress={() => setExpenseModal(true)} style={[styles.goldMiniBtn, { backgroundColor: '#EF4444' }]}><Text style={[styles.goldMiniBtnText, { color: '#FFF' }]}>+ Expense</Text></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }} style={{ marginTop: 12 }}>
              {expenses.map(exp => (
                <View key={exp.id} style={styles.darkItemCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemMainName}>{exp.title} ({exp.category})</Text>
                    <Text style={styles.dimSubText}>{exp.expense_date} • {exp.description}</Text>
                  </View>
                  <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 16 }}>- ₹{exp.amount}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* TAB 4: FACULTY / STAFF */}
          <View style={{ width: SCREEN_WIDTH, padding: 16 }}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Faculty / Staff ({staffList.length})</Text>
              <TouchableOpacity onPress={() => setStaffModal(true)} style={styles.goldMiniBtn}><Text style={styles.goldMiniBtnText}>+ Staff</Text></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }} style={{ marginTop: 12 }}>
              {staffList.map(st => (
                <View key={st.id} style={styles.darkItemCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemMainName}>{st.name} ({st.role})</Text>
                    <Text style={styles.dimSubText}>Salary: ₹{st.monthly_salary}/mo • +{st.phone}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity onPress={async () => {
                      const next = st.attendance === 'P' ? 'A' : 'P';
                      setStaffList(prev => prev.map(s => s.id === st.id ? { ...s, attendance: next } : s));
                      await fetch(`${SUPABASE_URL}/rest/v1/staff_members?id=eq.${st.id}`, { method: 'PATCH', headers, body: JSON.stringify({ attendance: next }) });
                    }} style={[styles.statusToggleBtn, { backgroundColor: st.attendance === 'P' ? '#10B981' : '#EF4444' }]}>
                      <Text style={styles.statusToggleText}>{st.attendance === 'P' ? 'P' : 'A'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* TAB 5: HOMEWORK & NOTES */}
          <View style={{ width: SCREEN_WIDTH, padding: 16 }}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Homework & Notes</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity onPress={() => setAdminHomeworkModal(true)} style={styles.goldMiniBtn}><Text style={styles.goldMiniBtnText}>+ HW</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setMaterialModal(true)} style={styles.goldMiniBtn}><Text style={styles.goldMiniBtnText}>+ PDF</Text></TouchableOpacity>
              </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }} style={{ marginTop: 12 }}>
              {homeworkList.map(hw => (
                <View key={hw.id} style={styles.darkItemCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemMainName}>{hw.task_title} ({hw.subject})</Text>
                    <Text style={styles.dimSubText}>Batch: {hw.batch_target} • Due: {hw.due_date}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* TAB 6: TESTS & DIGITAL REPORT CARDS */}
          <View style={{ width: SCREEN_WIDTH, padding: 16 }}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Exam & Tests ({testRecords.length})</Text>
              <TouchableOpacity onPress={() => setTestModal(true)} style={styles.goldMiniBtn}><Text style={styles.goldMiniBtnText}>+ Score</Text></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }} style={{ marginTop: 12 }}>
              {testRecords.map(tr => (
                <View key={tr.id} style={styles.darkItemCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemMainName}>{tr.student_name} - {tr.test_title}</Text>
                    <Text style={styles.dimSubText}>{tr.subject}: {tr.marks_obtained}/{tr.max_marks}</Text>
                  </View>
                  <TouchableOpacity style={styles.goldActionBtnSmall} onPress={() => {
                    const student = students.find(s => String(s.id) === String(tr.student_id));
                    if (student) openWhatsAppUniversal(student.phone, `Report Card: ${tr.student_name}, Score: ${tr.marks_obtained}/${tr.max_marks} in ${tr.subject}`);
                  }}>
                    <Ionicons name="logo-whatsapp" size={13} color="#000" />
                    <Text style={styles.goldActionBtnText}>Report</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* TAB 7: FULL SETTINGS (COACHING LOGO, PIN, UPI, EXCEL EXPORT) */}
          <View style={{ width: SCREEN_WIDTH, padding: 16 }}>
            <Text style={styles.sectionHeading}>Full App Settings ⚙️</Text>
            <Text style={styles.dimSubText}>Institute Branding, Security, UPI & Controls</Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }} style={{ marginTop: 12 }}>
              
              {/* Logo & Institute Branding */}
              <View style={[styles.settingsGroupCard, { padding: 14, marginBottom: 12 }]}>
                <Text style={styles.groupHeading}>Coaching Institute Profile & Logo</Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 10 }}>
                  {inputLogoUrl || coachingLogo ? (
                    <Image source={{ uri: inputLogoUrl || coachingLogo }} style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#F59E0B' }} />
                  ) : (
                    <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#262D3D', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F59E0B' }}>
                      <Ionicons name="image" size={26} color="#F59E0B" />
                    </View>
                  )}

                  <View style={{ flex: 1, gap: 6 }}>
                    <TouchableOpacity
                      style={[styles.goldMiniBtn, { alignSelf: 'flex-start' }]}
                      onPress={() => openDeviceGallery((b64) => setInputLogoUrl(b64))}
                    >
                      <Ionicons name="cloud-upload" size={14} color="#000" />
                      <Text style={styles.goldMiniBtnText}>Choose Logo from Gallery</Text>
                    </TouchableOpacity>
                    <Text style={styles.dimSubText}>Ya logo image URL neeche enter karein</Text>
                  </View>
                </View>

                <Text style={styles.darkInputLabel}>Logo Image Link (URL)</Text>
                <TextInput style={styles.darkInput} placeholder="https://example.com/logo.png" placeholderTextColor="#64748B" value={inputLogoUrl} onChangeText={setInputLogoUrl} />

                <Text style={styles.darkInputLabel}>Coaching Institute Name</Text>
                <TextInput style={styles.darkInput} value={inputCoachingName} onChangeText={setInputCoachingName} placeholderTextColor="#64748B" />

                <Text style={styles.darkInputLabel}>Tagline / Subtitle</Text>
                <TextInput style={styles.darkInput} value={inputTagline} onChangeText={setInputTagline} placeholderTextColor="#64748B" />

                <Text style={styles.darkInputLabel}>Coaching UPI ID (For Online Fee QR Code) *</Text>
                <TextInput style={styles.darkInput} value={inputUpiId} onChangeText={setInputUpiId} placeholder="e.g. yourname@upi" placeholderTextColor="#64748B" />

                <TouchableOpacity style={styles.goldPrimaryBtn} onPress={() => {
                  setCoachingName(inputCoachingName);
                  setCoachingTagline(inputTagline);
                  setCoachingUpiId(inputUpiId.trim() || 'ilmora@upi');
                  if (inputLogoUrl) setCoachingLogo(inputLogoUrl);
                  alert('Institute profile & logo saved successfully!');
                }}>
                  <Text style={styles.goldPrimaryBtnText}>Save Profile & Logo</Text>
                </TouchableOpacity>
              </View>

              {/* Admin Security & PIN */}
              <View style={[styles.settingsGroupCard, { padding: 14, marginBottom: 12 }]}>
                <Text style={styles.groupHeading}>Admin Security</Text>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, justifyContent: 'space-between' }} onPress={() => setPinChangeModal(true)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="key" size={18} color="#F59E0B" />
                    <Text style={{ color: '#FFF', fontSize: 13 }}>Change 4-Digit Admin PIN</Text>
                  </View>
                  <Text style={{ color: '#F59E0B', fontWeight: '800' }}>{adminPin} ›</Text>
                </TouchableOpacity>
              </View>

              {/* Additional Options */}
              <View style={[styles.settingsGroupCard, { padding: 14, marginBottom: 12 }]}>
                <Text style={styles.groupHeading}>System Controls & Automation</Text>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
                  <Text style={{ color: '#FFF', fontSize: 13 }}>Advance Fee Payment Lock</Text>
                  <Switch value={advanceFeeToggle} onValueChange={setAdvanceFeeToggle} trackColor={{ false: '#262D3D', true: '#F59E0B' }} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
                  <Text style={{ color: '#FFF', fontSize: 13 }}>WhatsApp Default Mode</Text>
                  <TouchableOpacity onPress={() => setWaMode(waMode === 'Personal' ? 'Business' : 'Personal')}>
                    <Text style={{ color: '#F59E0B', fontWeight: '800' }}>{waMode} App</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Data Export (CSV / Excel) */}
              <View style={[styles.settingsGroupCard, { padding: 14, marginBottom: 12 }]}>
                <Text style={styles.groupHeading}>Data Backup & Export (Excel / CSV)</Text>
                <TouchableOpacity style={[styles.goldPrimaryBtn, { backgroundColor: '#10B981', marginTop: 6 }]} onPress={() => {
                  let csv = "Roll No,Name,Batch,Fee,Status,Phone\n";
                  students.forEach(s => { csv += `${s.roll_no},${s.name},${s.batch},${s.monthly_fee},${s.fee_status},+${s.phone}\n`; });
                  setCsvPreviewModal(csv);
                }}>
                  <Text style={styles.goldPrimaryBtnText}>Export Students Data to Excel (CSV)</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.goldFab} onPress={() => setQuickActionModal(true)}>
        <Ionicons name="add" size={28} color="#000" />
      </TouchableOpacity>

      {/* PIN Change Modal */}
      <Modal visible={pinChangeModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.darkModalCard}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Change 4-Digit Admin PIN</Text>
              <TouchableOpacity onPress={() => setPinChangeModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <TextInput
              style={[styles.darkInput, { fontSize: 20, textAlign: 'center', letterSpacing: 8, marginVertical: 14 }]}
              placeholder="••••"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              maxLength={4}
              value={newPinInput}
              onChangeText={setNewPinInput}
            />
            <TouchableOpacity style={styles.goldPrimaryBtn} onPress={() => {
              if (newPinInput.length === 4) {
                setAdminPin(newPinInput);
                setNewPinInput('');
                setPinChangeModal(false);
                alert(`Admin PIN updated: ${newPinInput}`);
              }
            }}>
              <Text style={styles.goldPrimaryBtnText}>Update PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Quick Action Sheet */}
      <Modal visible={quickActionModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.darkModalCard}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Quick Action</Text>
              <TouchableOpacity onPress={() => setQuickActionModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <TouchableOpacity style={{ paddingVertical: 12 }} onPress={() => { setQuickActionModal(false); setAdmissionModal(true); }}>
              <Text style={{ color: '#FFF', fontSize: 14 }}>+ New Admission</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingVertical: 12 }} onPress={() => { setQuickActionModal(false); setEnquiryModal(true); }}>
              <Text style={{ color: '#FFF', fontSize: 14 }}>+ New Lead / Enquiry</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingVertical: 12 }} onPress={() => { setQuickActionModal(false); setExpenseModal(true); }}>
              <Text style={{ color: '#FFF', fontSize: 14 }}>+ Record Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingVertical: 12 }} onPress={() => { setQuickActionModal(false); setBroadcastModal(true); }}>
              <Text style={{ color: '#FFF', fontSize: 14 }}>+ WhatsApp Bulk Notice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Admission Modal */}
      <Modal visible={admissionModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.darkModalCard}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Student Admission Form</Text>
              <TouchableOpacity onPress={() => setAdmissionModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              <View style={{ alignItems: 'center', marginBottom: 12 }}>
                <TouchableOpacity
                  style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#262D3D', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 2, borderColor: '#F59E0B' }}
                  onPress={() => openDeviceGallery((b64) => setNewPhotoBase64(b64))}
                >
                  {newPhotoBase64 ? (
                    <Image source={{ uri: newPhotoBase64 }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Ionicons name="camera" size={24} color="#F59E0B" />
                  )}
                </TouchableOpacity>
                <Text style={{ color: '#64748B', fontSize: 10, marginTop: 4 }}>Gallery Photo</Text>
              </View>

              <Text style={styles.darkInputLabel}>Full Name *</Text>
              <TextInput style={styles.darkInput} placeholder="Student Name" placeholderTextColor="#64748B" value={newName} onChangeText={setNewName} />
              <Text style={styles.darkInputLabel}>Father Name</Text>
              <TextInput style={styles.darkInput} placeholder="Father Name" placeholderTextColor="#64748B" value={newFather} onChangeText={setNewFather} />
              <Text style={styles.darkInputLabel}>Roll No *</Text>
              <TextInput style={styles.darkInput} placeholder="101" placeholderTextColor="#64748B" value={newRoll} onChangeText={setNewRoll} />
              <Text style={styles.darkInputLabel}>Monthly Fee (₹)</Text>
              <TextInput style={styles.darkInput} placeholder="1500" placeholderTextColor="#64748B" keyboardType="numeric" value={newFee} onChangeText={setNewFee} />
              <Text style={styles.darkInputLabel}>Guardian WhatsApp *</Text>
              <TextInput style={styles.darkInput} placeholder="10 Digit Mobile" placeholderTextColor="#64748B" keyboardType="phone-pad" value={newPhone} onChangeText={setNewPhone} />
              <TouchableOpacity style={styles.goldPrimaryBtn} onPress={handleAdmission}>
                <Text style={styles.goldPrimaryBtnText}>Save Admission</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Selected Student Profile Modal */}
      <Modal visible={selectedStudent !== null} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.darkModalCard}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Student Profile</Text>
              <TouchableOpacity onPress={() => setSelectedStudent(null)}><Ionicons name="close-circle" size={24} color="#94A3B8" /></TouchableOpacity>
            </View>

            {selectedStudent && (
              <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 12 }}>
                <View style={{ alignItems: 'center', marginBottom: 14 }}>
                  {selectedStudent.photo_url ? (
                    <Image source={{ uri: selectedStudent.photo_url }} style={styles.avatarLargeCircle} />
                  ) : (
                    <View style={styles.avatarLargeCircle}>
                      <Text style={{ fontSize: 24, color: '#F59E0B', fontWeight: '800' }}>{selectedStudent.name.charAt(0)}</Text>
                    </View>
                  )}
                  <Text style={[styles.itemMainName, { fontSize: 18, marginTop: 8 }]}>{selectedStudent.name}</Text>
                  <Text style={styles.dimSubText}>Roll #{selectedStudent.roll_no} • Code: ILM-{selectedStudent.roll_no}</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                  <TouchableOpacity style={styles.goldPrimaryBtn} onPress={() => Linking.openURL(`tel:+${selectedStudent.phone}`)}>
                    <Text style={styles.goldPrimaryBtnText}>Call Guardian</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.goldPrimaryBtn, { backgroundColor: '#25D366' }]} onPress={() => openWhatsAppUniversal(selectedStudent.phone, `Fee update for ${selectedStudent.name}`)}>
                    <Text style={[styles.goldPrimaryBtnText, { color: '#FFF' }]}>Send Slip</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: '#11141B', borderRadius: 8, padding: 10, gap: 4 }}>
                  <View style={styles.detailRow}><Text style={styles.dimSubText}>Batch:</Text><Text style={styles.brightVal}>{selectedStudent.batch}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.dimSubText}>Monthly Fee:</Text><Text style={styles.brightVal}>₹{selectedStudent.monthly_fee}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.dimSubText}>Fee Status:</Text><Text style={{ color: selectedStudent.fee_status === 'Paid' ? '#34D399' : '#F87171', fontWeight: '700' }}>{selectedStudent.fee_status}</Text></View>
                </View>

                <TouchableOpacity style={{ marginTop: 14, alignItems: 'center' }} onPress={() => handleDeleteStudent(selectedStudent.id)}>
                  <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '700' }}>Delete Student Record</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Enquiry Modal */}
      <Modal visible={enquiryModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.darkModalCard}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>New Admission Lead</Text>
              <TouchableOpacity onPress={() => setEnquiryModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              <TextInput style={styles.darkInput} placeholder="Student/Parent Name" placeholderTextColor="#64748B" value={enqName} onChangeText={setEnqName} />
              <TextInput style={styles.darkInput} placeholder="10 Digit Phone" placeholderTextColor="#64748B" keyboardType="phone-pad" value={enqPhone} onChangeText={setEnqPhone} />
              <TextInput style={styles.darkInput} placeholder="Follow-up Date (YYYY-MM-DD)" placeholderTextColor="#64748B" value={enqFollowDate} onChangeText={setEnqFollowDate} />
              <TextInput style={styles.darkInput} placeholder="Notes" placeholderTextColor="#64748B" value={enqNotes} onChangeText={setEnqNotes} />
              <TouchableOpacity style={styles.goldPrimaryBtn} onPress={async () => {
                if (!enqName.trim() || !enqPhone.trim()) return;
                const res = await fetch(`${SUPABASE_URL}/rest/v1/enquiries`, {
                  method: 'POST',
                  headers: { ...headers, Prefer: 'return=representation' },
                  body: JSON.stringify({ student_name: enqName, phone: enqPhone, batch_interested: enqBatch, follow_up_date: enqFollowDate, notes: enqNotes, status: 'Active' })
                });
                const data = await res.json();
                if (Array.isArray(data)) setEnquiries([data[0], ...enquiries]);
                setEnquiryModal(false);
              }}>
                <Text style={styles.goldPrimaryBtnText}>Save Lead</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Expense Modal */}
      <Modal visible={expenseModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.darkModalCard}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Record Expense</Text>
              <TouchableOpacity onPress={() => setExpenseModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <TextInput style={[styles.darkInput, { marginTop: 10 }]} placeholder="Title (e.g. Rent, Printing)" placeholderTextColor="#64748B" value={expTitle} onChangeText={setExpTitle} />
            <TextInput style={styles.darkInput} placeholder="Amount (₹)" placeholderTextColor="#64748B" keyboardType="numeric" value={expAmount} onChangeText={setExpAmount} />
            <TouchableOpacity style={[styles.goldPrimaryBtn, { backgroundColor: '#EF4444' }]} onPress={async () => {
              if (!expTitle.trim() || !expAmount.trim()) return;
              const res = await fetch(`${SUPABASE_URL}/rest/v1/expenses`, {
                method: 'POST',
                headers: { ...headers, Prefer: 'return=representation' },
                body: JSON.stringify({ title: expTitle, category: expCategory, amount: expAmount, expense_date: new Date().toISOString().split('T')[0], description: expDesc })
              });
              const data = await res.json();
              if (Array.isArray(data)) setExpenses([data[0], ...expenses]);
              setExpenseModal(false);
            }}>
              <Text style={[styles.goldPrimaryBtnText, { color: '#FFF' }]}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Staff Modal */}
      <Modal visible={staffModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.darkModalCard}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Add Staff</Text>
              <TouchableOpacity onPress={() => setStaffModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <TextInput style={[styles.darkInput, { marginTop: 10 }]} placeholder="Staff Name" placeholderTextColor="#64748B" value={staffName} onChangeText={setStaffName} />
            <TextInput style={styles.darkInput} placeholder="Phone" placeholderTextColor="#64748B" keyboardType="phone-pad" value={staffPhone} onChangeText={setStaffPhone} />
            <TextInput style={styles.darkInput} placeholder="Monthly Salary (₹)" placeholderTextColor="#64748B" keyboardType="numeric" value={staffSalary} onChangeText={setStaffSalary} />
            <TouchableOpacity style={styles.goldPrimaryBtn} onPress={async () => {
              if (!staffName.trim()) return;
              const res = await fetch(`${SUPABASE_URL}/rest/v1/staff_members`, {
                method: 'POST',
                headers: { ...headers, Prefer: 'return=representation' },
                body: JSON.stringify({ name: staffName, role: staffRole, phone: staffPhone, monthly_salary: staffSalary, attendance: 'P', salary_status: 'Pending' })
              });
              const data = await res.json();
              if (Array.isArray(data)) setStaffList([data[0], ...staffList]);
              setStaffModal(false);
            }}>
              <Text style={styles.goldPrimaryBtnText}>Save Staff</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Homework Modal */}
      <Modal visible={adminHomeworkModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.darkModalCard}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Assign Homework</Text>
              <TouchableOpacity onPress={() => setAdminHomeworkModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <TextInput style={[styles.darkInput, { marginTop: 10 }]} placeholder="Subject" placeholderTextColor="#64748B" value={hwSubject} onChangeText={setHwSubject} />
            <TextInput style={styles.darkInput} placeholder="Task Title" placeholderTextColor="#64748B" value={hwTitle} onChangeText={setHwTitle} />
            <TextInput style={styles.darkInput} placeholder="Due Date (YYYY-MM-DD)" placeholderTextColor="#64748B" value={hwDueDate} onChangeText={setHwDueDate} />
            <TouchableOpacity style={styles.goldPrimaryBtn} onPress={handleSaveHomework}>
              <Text style={styles.goldPrimaryBtnText}>Publish Homework</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Study Material Modal */}
      <Modal visible={materialModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.darkModalCard}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Upload Notes / PDF</Text>
              <TouchableOpacity onPress={() => setMaterialModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <TextInput style={[styles.darkInput, { marginTop: 10 }]} placeholder="Chapter Name" placeholderTextColor="#64748B" value={matTitle} onChangeText={setMatTitle} />
            <TextInput style={styles.darkInput} placeholder="PDF / Drive Link" placeholderTextColor="#64748B" value={matUrl} onChangeText={setMatUrl} />
            <TouchableOpacity style={styles.goldPrimaryBtn} onPress={handleSaveMaterial}>
              <Text style={styles.goldPrimaryBtnText}>Save Material</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Test Score Modal */}
      <Modal visible={testModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.darkModalCard}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Record Test Score</Text>
              <TouchableOpacity onPress={() => setTestModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              <TextInput style={styles.darkInput} placeholder="Test Title" placeholderTextColor="#64748B" value={testTitle} onChangeText={setTestTitle} />
              <TextInput style={styles.darkInput} placeholder="Subject" placeholderTextColor="#64748B" value={testSubject} onChangeText={setTestSubject} />
              <TextInput style={styles.darkInput} placeholder="Marks Obtained" placeholderTextColor="#64748B" keyboardType="numeric" value={testMarksObt} onChangeText={setTestMarksObt} />
              <Text style={styles.darkInputLabel}>Select Student</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {students.map(s => (
                  <TouchableOpacity key={s.id} onPress={() => setTestStudentId(s.id)} style={[styles.goldMiniBtn, testStudentId === s.id ? { backgroundColor: '#F59E0B' } : { backgroundColor: '#262D3D' }]}>
                    <Text style={{ color: testStudentId === s.id ? '#000' : '#FFF', fontSize: 11 }}>{s.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.goldPrimaryBtn} onPress={handleSaveTestScore}>
                <Text style={styles.goldPrimaryBtnText}>Save Score</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bulk Broadcast Modal */}
      <Modal visible={broadcastModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.darkModalCard}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>WhatsApp Notice Broadcast 📢</Text>
              <TouchableOpacity onPress={() => setBroadcastModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <TextInput
              style={[styles.darkInput, { height: 90, marginTop: 10, textAlignVertical: 'top' }]}
              multiline
              placeholder="Notice message for parents/students..."
              placeholderTextColor="#64748B"
              value={bcMessage}
              onChangeText={setBcMessage}
            />
            <TouchableOpacity style={[styles.goldPrimaryBtn, { backgroundColor: '#25D366' }]} onPress={() => {
              if (!bcMessage.trim()) return;
              const msg = `📢 *NOTICE - ${coachingName}*\n\n${bcMessage}\n\n- Administration`;
              Linking.openURL(`whatsapp://send?text=${encodeURIComponent(msg)}`);
              setBroadcastModal(false);
              setBcMessage('');
            }}>
              <Text style={[styles.goldPrimaryBtnText, { color: '#FFF' }]}>Send on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CSV Export Modal */}
      <Modal visible={csvPreviewModal !== null} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.darkModalCard}>
            <View style={styles.cardTitleBetween}>
              <Text style={styles.sectionHeading}>Students Registry (CSV)</Text>
              <TouchableOpacity onPress={() => setCsvPreviewModal(null)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 200, backgroundColor: '#11141B', padding: 8, borderRadius: 8, marginVertical: 10 }}>
              <Text style={{ color: '#34D399', fontSize: 10, fontFamily: 'monospace' }}>{csvPreviewModal}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.goldPrimaryBtn} onPress={() => {
              Linking.openURL(`whatsapp://send?text=${encodeURIComponent(csvPreviewModal)}`);
              setCsvPreviewModal(null);
            }}>
              <Text style={styles.goldPrimaryBtnText}>Share via WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* HORIZONTALLY SCROLLABLE BOTTOM BAR (SLIDE HONGE SAARE TABS & NO OVERLAP) */}
      <View style={styles.darkBottomBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, alignItems: 'center' }}
        >
          <TouchableOpacity style={styles.bottomTabItem} onPress={() => handleTabPress(0)}>
            <Ionicons name={activeTabIdx === 0 ? 'grid' : 'grid-outline'} size={18} color={activeTabIdx === 0 ? '#F59E0B' : '#64748B'} />
            <Text style={[styles.bottomTabText, activeTabIdx === 0 && { color: '#F59E0B', fontWeight: '800' }]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomTabItem} onPress={() => handleTabPress(1)}>
            <Ionicons name={activeTabIdx === 1 ? 'people' : 'people-outline'} size={18} color={activeTabIdx === 1 ? '#F59E0B' : '#64748B'} />
            <Text style={[styles.bottomTabText, activeTabIdx === 1 && { color: '#F59E0B', fontWeight: '800' }]}>Students</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomTabItem} onPress={() => handleTabPress(2)}>
            <Ionicons name={activeTabIdx === 2 ? 'call' : 'call-outline'} size={18} color={activeTabIdx === 2 ? '#F59E0B' : '#64748B'} />
            <Text style={[styles.bottomTabText, activeTabIdx === 2 && { color: '#F59E0B', fontWeight: '800' }]}>Leads</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomTabItem} onPress={() => handleTabPress(3)}>
            <Ionicons name={activeTabIdx === 3 ? 'cash' : 'cash-outline'} size={18} color={activeTabIdx === 3 ? '#F59E0B' : '#64748B'} />
            <Text style={[styles.bottomTabText, activeTabIdx === 3 && { color: '#F59E0B', fontWeight: '800' }]}>Expenses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomTabItem} onPress={() => handleTabPress(4)}>
            <Ionicons name={activeTabIdx === 4 ? 'briefcase' : 'briefcase-outline'} size={18} color={activeTabIdx === 4 ? '#F59E0B' : '#64748B'} />
            <Text style={[styles.bottomTabText, activeTabIdx === 4 && { color: '#F59E0B', fontWeight: '800' }]}>Staff</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomTabItem} onPress={() => handleTabPress(5)}>
            <Ionicons name={activeTabIdx === 5 ? 'clipboard' : 'clipboard-outline'} size={18} color={activeTabIdx === 5 ? '#F59E0B' : '#64748B'} />
            <Text style={[styles.bottomTabText, activeTabIdx === 5 && { color: '#F59E0B', fontWeight: '800' }]}>Homework</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomTabItem} onPress={() => handleTabPress(6)}>
            <Ionicons name={activeTabIdx === 6 ? 'document-text' : 'document-text-outline'} size={18} color={activeTabIdx === 6 ? '#F59E0B' : '#64748B'} />
            <Text style={[styles.bottomTabText, activeTabIdx === 6 && { color: '#F59E0B', fontWeight: '800' }]}>Tests</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomTabItem} onPress={() => handleTabPress(7)}>
            <Ionicons name={activeTabIdx === 7 ? 'settings' : 'settings-outline'} size={18} color={activeTabIdx === 7 ? '#F59E0B' : '#64748B'} />
            <Text style={[styles.bottomTabText, activeTabIdx === 7 && { color: '#F59E0B', fontWeight: '800' }]}>Settings</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#11141B' },
  safeTopPadding: { paddingTop: STATUSBAR_HEIGHT },
  topHeader: { backgroundColor: '#11141B', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F59E0B', justifyContent: 'center', alignItems: 'center' },
  avatarCircleText: { color: '#000', fontSize: 18, fontWeight: '800' },
  instituteTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '800' },
  instituteSubtitle: { color: '#64748B', fontSize: 11, marginTop: 1 },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#F59E0B', marginTop: 12, fontSize: 13, fontWeight: '600' },
  scrollPadding: { padding: 16, paddingBottom: 120 },

  switchRoleTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  switchRoleTabActive: { backgroundColor: '#F59E0B' },
  switchRoleText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },

  subscriptionBannerContainer: { backgroundColor: '#1A1E29', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderWidth: 1, borderColor: '#F59E0B44' },
  subMainHeading: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  renewNowActionBtn: { backgroundColor: '#F59E0B', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  renewNowActionText: { color: '#000', fontSize: 11, fontWeight: '800' },
  planSelectCard: { backgroundColor: '#11141B', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#262D3D', flexDirection: 'row', alignItems: 'center' },

  cardContainer: { backgroundColor: '#1A1E29', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#262D3D' },
  cardTitleBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionHeading: { color: '#F8FAFC', fontSize: 14, fontWeight: '700' },
  dimSubText: { color: '#64748B', fontSize: 11 },

  cardHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#262D3D', paddingBottom: 8, marginBottom: 10 },
  cardHeadColLeft: { flex: 1, color: '#64748B', fontSize: 11, fontWeight: '600' },
  cardHeadCol: { width: 60, textAlign: 'center', color: '#64748B', fontSize: 11, fontWeight: '600' },
  cardDataRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  cardDataLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardLabelText: { color: '#CBD5E1', fontSize: 12 },
  cardValText: { width: 60, textAlign: 'center', color: '#FFF', fontSize: 13, fontWeight: '700' },

  darkItemCard: { backgroundColor: '#1A1E29', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#262D3D', flexDirection: 'row', alignItems: 'center' },
  itemMainName: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  goldMiniBtn: { backgroundColor: '#F59E0B', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4 },
  goldMiniBtnText: { color: '#000', fontSize: 11, fontWeight: '800' },
  goldPrimaryBtn: { backgroundColor: '#F59E0B', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 14 },
  goldPrimaryBtnText: { color: '#000', fontSize: 13, fontWeight: '800' },
  goldActionBtnSmall: { backgroundColor: '#F59E0B', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, gap: 4 },
  goldActionBtnText: { color: '#000', fontSize: 11, fontWeight: '800' },
  statusToggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  statusToggleText: { color: '#FFF', fontSize: 10, fontWeight: '800' },

  goldFab: { position: 'absolute', bottom: 85, right: 18, width: 52, height: 52, borderRadius: 16, backgroundColor: '#F59E0B', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  settingsGroupCard: { backgroundColor: '#1A1E29', borderRadius: 14, borderWidth: 1, borderColor: '#262D3D' },
  groupHeading: { color: '#F59E0B', fontSize: 11, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', padding: 16 },
  darkModalCard: { backgroundColor: '#1A1E29', borderRadius: 16, padding: 16, maxHeight: '85%', borderWidth: 1, borderColor: '#262D3D' },
  darkInputLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  darkInput: { backgroundColor: '#11141B', borderWidth: 1, borderColor: '#262D3D', borderRadius: 8, padding: 10, color: '#FFF', fontSize: 13, marginBottom: 10 },
  avatarLargeCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#262D3D', justifyContent: 'center', alignItems: 'center' },

  // Scrollable & Non-Overlapping Bottom Navigation
  darkBottomBarContainer: {
    backgroundColor: '#11141B',
    borderTopWidth: 1,
    borderTopColor: '#1E2433',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'android' ? 24 : 14,
  },
  bottomTabItem: {
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  bottomTabText: { fontSize: 9, color: '#64748B', marginTop: 3 },

  quickActionCardPill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#262D3D' },
  pillActionText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  brightVal: { color: '#FFF', fontSize: 12, fontWeight: '600' },

  darkChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#262D3D' },
  darkChipActive: { backgroundColor: '#F59E0B' },
  darkChipText: { color: '#94A3B8', fontSize: 11, fontWeight: '700' },
});
