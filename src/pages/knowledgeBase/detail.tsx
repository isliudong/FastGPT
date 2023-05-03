import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  Grid,
  Flex,
  Button,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input
} from '@chakra-ui/react';
import type { BoxProps } from '@chakra-ui/react';
import { QuestionOutlineIcon, DeleteIcon, EditIcon, RepeatIcon } from '@chakra-ui/icons';
import { getKbDataList } from '@/api/plugins';
import { usePagination } from '@/hooks/usePagination';
import type { PgKbDataItemType } from '@/types/pg';
import { KbDataStatusMap } from '@/constants/plugins';

const KbDetail = ({ id: kbId, name }: { id: string; name: string }) => {
  const tdStyles = useRef<BoxProps>({
    fontSize: 'xs',
    minW: '150px',
    maxW: '500px',
    maxH: '250px',
    whiteSpace: 'pre-wrap',
    overflowY: 'auto'
  });
  const [searchText, setSearchText] = useState('');

  const {
    data: kbDataList,
    isLoading,
    Pagination,
    total,
    getData,
    pageNum
  } = usePagination<PgKbDataItemType>({
    api: getKbDataList,
    pageSize: 10,
    params: {
      kbId,
      searchText
    }
  });
  console.log(kbDataList);
  return (
    <>
      <Card px={6} py={4}>
        <Flex alignItems={'center'}>
          <Box fontSize={'xl'} fontWeight={'bold'} flex={1}>
            {name}
          </Box>
          <Button size={'sm'} colorScheme={'red'} variant={'outline'}>
            删除
          </Button>
        </Flex>
      </Card>

      <Card mt={4} p={4}>
        <Flex>
          <Box fontWeight={'bold'} fontSize={'lg'} flex={1} mr={2}>
            知识库数据: {total}组
          </Box>
          <IconButton
            icon={<RepeatIcon />}
            aria-label={'refresh'}
            variant={'outline'}
            mr={4}
            size={'sm'}
          />
          <Button variant={'outline'} mr={2} size={'sm'} title={'换行数据导出时，会进行格式转换'}>
            导出
          </Button>
          <Menu autoSelect={false}>
            <MenuButton as={Button} size={'sm'}>
              导入
            </MenuButton>
            <MenuList>
              <MenuItem>手动输入</MenuItem>
              <MenuItem>文本/文件拆分</MenuItem>
              <MenuItem>csv 问答对导入</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <Flex my={4}>
          {/* {splitDataLen > 0 && (
          <Box fontSize={'xs'}>{splitDataLen}条数据正在拆分，请耐心等待...</Box>
        )} */}
          <Box flex={1} />
          <Input
            maxW={'240px'}
            size={'sm'}
            value={searchText}
            placeholder="搜索相关问题和答案，回车确认"
            onChange={(e) => setSearchText(e.target.value)}
            onBlur={() => {
              if (searchText === lastSearch.current) return;
              getData(1);
              lastSearch.current = searchText;
            }}
            onKeyDown={(e) => {
              if (searchText === lastSearch.current) return;
              if (e.key === 'Enter') {
                getData(1);
                lastSearch.current = searchText;
              }
            }}
          />
        </Flex>
        <TableContainer minH={'500px'}>
          <Table variant={'simple'} w={'100%'}>
            <Thead>
              <Tr>
                <Th>
                  匹配的知识点
                  <Tooltip
                    label={
                      '对话时，会将用户的问题和知识库的 "匹配知识点" 进行比较，找到最相似的前 n 条记录，将这些记录的 "匹配知识点"+"补充知识点" 作为 chatgpt 的系统提示词。'
                    }
                  >
                    <QuestionOutlineIcon ml={1} />
                  </Tooltip>
                </Th>
                <Th>补充知识</Th>
                <Th>状态</Th>
                <Th>操作</Th>
              </Tr>
            </Thead>
            <Tbody>
              {kbDataList.map((item) => (
                <Tr key={item.id}>
                  <Td>
                    <Box {...tdStyles.current}>{item.q}</Box>
                  </Td>
                  <Td>
                    <Box {...tdStyles.current}>{item.a || '-'}</Box>
                  </Td>
                  <Td>{KbDataStatusMap[item.status]}</Td>
                  <Td>
                    <IconButton
                      mr={5}
                      icon={<EditIcon />}
                      variant={'outline'}
                      aria-label={'delete'}
                      size={'sm'}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      variant={'outline'}
                      colorScheme={'gray'}
                      aria-label={'delete'}
                      size={'sm'}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Box mt={2} textAlign={'end'}>
          <Pagination />
        </Box>
      </Card>
    </>
  );
};

export default KbDetail;

export async function getServerSideProps(context: any) {
  return {
    props: { id: context.query?.id || '', name: context.query?.name || '知识库' }
  };
}
